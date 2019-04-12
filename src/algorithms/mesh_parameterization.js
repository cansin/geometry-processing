import math from "mathjs";
import { CircleGeometry, Vector3 } from "three";

import { BOUNDARY_SHAPES, WEIGHT_APPROACHES } from "../constants";
import { createVertex } from "../objects";

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

export function generateMeshParameterization({
    geometry,
    graph,
    weightApproach,
    boundaryShape,
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
    const boundaryVertices = new Set();
    edgeCounts.forEach((count, edge) => {
        if (count === 1) {
            boundaryEdges.add({
                vertices: [
                    geometry.vertices[Number(edge.split(",")[0])],
                    geometry.vertices[Number(edge.split(",")[1])],
                ],
            });
            boundaryVertices.add(geometry.vertices[Number(edge.split(",")[0])]);
            boundaryVertices.add(geometry.vertices[Number(edge.split(",")[1])]);
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating W, bx, and by matrices...`);

    const length = geometry.vertices.length;
    const W = math.zeros(length, length);
    const bx = math.zeros(length);
    const by = math.zeros(length);

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
                // As described at https://www.jwwalker.com/pages/angle-between-vectors.html
                const dot12 = vertex1.dot(vertex2);
                const dot11 = vertex1.dot(vertex1);
                const dot22 = vertex2.dot(vertex2);
                const angle = math.acos(dot12 / math.sqrt(dot11 * dot22));

                value = math.cot(angle) / 2;
            } else if (WEIGHT_APPROACHES[weightApproach] === WEIGHT_APPROACHES.MeanValue) {
                const dotOther2 = otherVertex.dot(vertex2);
                const dotOtherOther = otherVertex.dot(otherVertex);
                const dot22 = vertex2.dot(vertex2);
                const angle = math.acos(dotOther2 / math.sqrt(dotOtherOther * dot22));

                value = math.tan(angle / 2) / (2 * vertex1.distanceTo(vertex2));
            }

            if (!boundaryVertices.has(vertex1)) {
                const acc = W.subset(math.index(vertexIndex1, vertexIndex2));
                W.subset(math.index(vertexIndex1, vertexIndex2), acc + value);
            }

            if (!boundaryVertices.has(vertex2)) {
                const acc = W.subset(math.index(vertexIndex2, vertexIndex1));
                W.subset(math.index(vertexIndex2, vertexIndex1), acc + value);
            }
        });
    });

    geometry.vertices.forEach((vertex, index) => {
        if (!boundaryVertices.has(vertex)) {
            const row = W.subset(math.index(index, math.range(0, length)));
            let value = 0;
            row.forEach(cur => {
                value = value - cur;
            });

            W.subset(math.index(index, index), value);
        } else {
            W.subset(math.index(index, index), 1);

            if (BOUNDARY_SHAPES[boundaryShape] === BOUNDARY_SHAPES.Free) {
                bx.subset(math.index(index), vertex.x);
                by.subset(math.index(index), vertex.y);
            } else if (BOUNDARY_SHAPES[boundaryShape] === BOUNDARY_SHAPES.Circle) {
                const circleGeometry = new CircleGeometry(75, boundaryVertices.size);
                const { closest } = findClosestVertex(vertex, circleGeometry.vertices);

                bx.subset(math.index(index), closest.x);
                by.subset(math.index(index), closest.y);
            }
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating inverse W matrix...`);

    const Wi = math.inv(W);

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating xx, and xy matrices...`);

    const xx = math.multiply(Wi, bx);
    const xy = math.multiply(Wi, by);

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Creating parameterization edges...`);

    const allEdges = new Set();
    geometry.faces.forEach(face => {
        allEdges.add({
            vertices: [
                new Vector3(
                    math.subset(xx, math.index(face.a)),
                    math.subset(xy, math.index(face.a)),
                    0,
                ),
                new Vector3(
                    math.subset(xx, math.index(face.b)),
                    math.subset(xy, math.index(face.b)),
                    0,
                ),
            ],
        });

        allEdges.add({
            vertices: [
                new Vector3(
                    math.subset(xx, math.index(face.a)),
                    math.subset(xy, math.index(face.a)),
                    0,
                ),
                new Vector3(
                    math.subset(xx, math.index(face.c)),
                    math.subset(xy, math.index(face.c)),
                    0,
                ),
            ],
        });

        allEdges.add({
            vertices: [
                new Vector3(
                    math.subset(xx, math.index(face.b)),
                    math.subset(xy, math.index(face.b)),
                    0,
                ),
                new Vector3(
                    math.subset(xx, math.index(face.c)),
                    math.subset(xy, math.index(face.c)),
                    0,
                ),
            ],
        });
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        allEdges,
        boundaryEdges,
        boundaryVertices,
    };
}
