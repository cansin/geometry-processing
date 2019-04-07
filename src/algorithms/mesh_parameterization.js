import math from "mathjs";
import { Vector3 } from "three";

export function generateMeshParameterization({ geometry, graph, logger }) {
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding boundary vertices...`);

    const edgeCounts = new Map();
    geometry.faces.forEach(face => {
        let vertexIndex1 = Math.min(face.a, face.b),
            vertexIndex2 = Math.max(face.a, face.b),
            identifier = `${vertexIndex1},${vertexIndex2}`;
        edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);

        vertexIndex1 = Math.min(face.a, face.c);
        vertexIndex2 = Math.max(face.a, face.c);
        identifier = `${vertexIndex1},${vertexIndex2}`;
        edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);

        vertexIndex1 = Math.min(face.b, face.c);
        vertexIndex2 = Math.max(face.b, face.c);
        identifier = `${vertexIndex1},${vertexIndex2}`;
        edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);
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
    const W = math.identity(length);
    const bx = math.zeros(length);
    const by = math.zeros(length);
    geometry.vertices.forEach((vertex, index) => {
        if (!boundaryVertices.has(vertex)) {
            const row = Array(length).fill(0);
            graph.neighbors(vertex).forEach(neighbor => {
                row[geometry.vertices.indexOf(neighbor)] = 1;
            });

            const value = row.reduce((acc, cur) => acc - cur, 0);
            row[index] = value;

            W.subset(math.index(index, math.range(0, W._size[0])), row);
        } else {
            bx.subset(math.index(index), vertex.x);
            by.subset(math.index(index), vertex.y);
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
