import math from "mathjs";
import { CircleGeometry, Vector3 } from "three";
import { inverse, Matrix } from "ml-matrix";

import { BOUNDARY_SHAPES, MOUTH_FIXATIONS, WEIGHT_APPROACHES } from "../constants";

function calculateAngle(vertex1, vertex2) {
    // As described at https://www.jwwalker.com/pages/angle-between-vectors.html
    const dot12 = vertex1.dot(vertex2);
    const dot11 = vertex1.dot(vertex1);
    const dot22 = vertex2.dot(vertex2);
    return math.acos(dot12 / math.sqrt(dot11 * dot22));
}

function findClosestVertex(source, targets) {
    let closest = undefined;
    let minDistance = Infinity;

    targets.forEach(target => {
        const currentDistance = target.distanceTo(source);
        if (currentDistance < minDistance) {
            closest = target;
            minDistance = currentDistance;
        }
    });

    return { closest, minDistance };
}

function shouldPin(vertex, initialBoundaryVertices, isMouthFixated) {
    return (
        initialBoundaryVertices.has(vertex) &&
        // This has should ideally be replaced by a generic solution
        (MOUTH_FIXATIONS[isMouthFixated] === MOUTH_FIXATIONS.True ||
            !(
                vertex.x >= -19 &&
                vertex.x <= 27 &&
                vertex.y >= -37 &&
                vertex.y <= -33 &&
                vertex.z >= 4 &&
                vertex.z <= 24
            ))
    );
}

export function generateMeshParameterization({
    geometry,
    weightApproach,
    boundaryShape,
    isMouthFixated,
    logger,
}) {
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding boundary vertices...`);

    const edgeCounts = new Map();
    geometry.faces.forEach(face => {
        const edges = [[face.a, face.b], [face.a, face.c], [face.b, face.c]];
        edges.forEach(([vertexIndex1, vertexIndex2]) => {
            let minIndex = Math.min(vertexIndex1, vertexIndex2),
                maxIndex = Math.max(vertexIndex1, vertexIndex2),
                identifier = `${minIndex},${maxIndex}`;
            edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);
        });
    });

    const boundaryEdges = new Set();
    const initialBoundaryVertices = new Set();
    const finalBoundaryVertices = new Set();
    edgeCounts.forEach((count, edge) => {
        if (count === 1) {
            boundaryEdges.add({
                vertices: [
                    geometry.vertices[Number(edge.split(",")[0])],
                    geometry.vertices[Number(edge.split(",")[1])],
                ],
            });
            initialBoundaryVertices.add(geometry.vertices[Number(edge.split(",")[0])]);
            initialBoundaryVertices.add(geometry.vertices[Number(edge.split(",")[1])]);
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating W, bx, and by matrices...`);

    const length = geometry.vertices.length;
    const W = Matrix.zeros(length, length);
    const bx = Matrix.zeros(length, 1);
    const by = Matrix.zeros(length, 1);

    geometry.faces.forEach(face => {
        const edges = [
            [face.a, face.b, face.c],
            [face.a, face.c, face.b],
            [face.b, face.c, face.a],
        ];

        edges.forEach(([vertexIndex1, vertexIndex2, otherVertexIndex]) => {
            const vertex1 = geometry.vertices[vertexIndex1],
                vertex2 = geometry.vertices[vertexIndex2],
                otherVertex = geometry.vertices[otherVertexIndex];
            let value;

            if (WEIGHT_APPROACHES[weightApproach] === WEIGHT_APPROACHES.Uniform) {
                value = 0.5;
            } else if (WEIGHT_APPROACHES[weightApproach] === WEIGHT_APPROACHES.Harmonic) {
                const angle = calculateAngle(
                    new Vector3().subVectors(vertex1, otherVertex),
                    new Vector3().subVectors(vertex2, otherVertex),
                );
                value = math.cot(angle) / 2;
            } else if (WEIGHT_APPROACHES[weightApproach] === WEIGHT_APPROACHES.MeanValue) {
                const angle = calculateAngle(
                    new Vector3().subVectors(otherVertex, vertex1),
                    new Vector3().subVectors(vertex2, vertex1),
                );
                value = math.tan(angle / 2) / (2 * vertex1.distanceTo(vertex2));
            }

            if (!shouldPin(vertex1, initialBoundaryVertices, isMouthFixated)) {
                const acc = W.get(vertexIndex1, vertexIndex2);
                W.set(vertexIndex1, vertexIndex2, acc + value);
            }

            if (!shouldPin(vertex2, initialBoundaryVertices, isMouthFixated)) {
                const acc = W.get(vertexIndex2, vertexIndex1);
                W.set(vertexIndex2, vertexIndex1, acc + value);
            }
        });
    });

    const circleVertices = new CircleGeometry(75, initialBoundaryVertices.size).vertices;
    circleVertices.shift();
    geometry.vertices.forEach((vertex, index) => {
        if (!shouldPin(vertex, initialBoundaryVertices, isMouthFixated)) {
            const row = W.getRow(index);
            let value = 0;
            row.forEach(cur => {
                value = value - cur;
            });

            W.set(index, index, value);
        } else {
            W.set(index, index, 1);

            if (
                BOUNDARY_SHAPES[boundaryShape] === BOUNDARY_SHAPES.Free ||
                (vertex.x >= -19 &&
                    vertex.x <= 27 &&
                    vertex.y >= -37 &&
                    vertex.y <= -33 &&
                    vertex.z >= 4 &&
                    vertex.z <= 24)
            ) {
                finalBoundaryVertices.add(new Vector3(vertex.x, vertex.y, 0));
                bx.set(index, 0, vertex.x);
                by.set(index, 0, vertex.y);
            } else if (BOUNDARY_SHAPES[boundaryShape] === BOUNDARY_SHAPES.Circle) {
                const { closest } = findClosestVertex(
                    new Vector3(vertex.x, vertex.y, 0),
                    circleVertices,
                );

                finalBoundaryVertices.add(new Vector3(closest.x, closest.y, 0));
                bx.set(index, 0, closest.x);
                by.set(index, 0, closest.y);
            }
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating inverse W matrix...`);

    const Wi = inverse(W);

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating xx, and xy matrices...`);

    const xx = Wi.mmul(bx);
    const xy = Wi.mmul(by);

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Creating parameterization edges...`);

    const allEdges = new Set();
    geometry.faces.forEach(face => {
        const edges = [[face.a, face.b], [face.a, face.c], [face.b, face.c]];

        edges.forEach(([vertexIndex1, vertexIndex2]) => {
            allEdges.add({
                vertices: [
                    new Vector3(xx.get(vertexIndex1, 0), xy.get(vertexIndex1, 0), 0),
                    new Vector3(xx.get(vertexIndex2, 0), xy.get(vertexIndex2, 0), 0),
                ],
            });
        });
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        allEdges,
        boundaryEdges,
        initialBoundaryVertices,
        finalBoundaryVertices,
    };
}
