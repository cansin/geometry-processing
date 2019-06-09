import { Color } from "three";

import { findBilateralMap } from "./bilateral_map";
import { findGeodesicDistance } from "./geodesic_distance";

export function findTriangularBilateralMap({
    geometry,
    graph,
    qType,
    logger,
    sourceVertexIndex,
    target1VertexIndex,
    target2VertexIndex,
}) {
    const { vertices } = geometry;
    const sourceVertex = vertices[sourceVertexIndex],
        target1Vertex = vertices[target1VertexIndex],
        target2Vertex = vertices[target2VertexIndex];
    const { scalarField: scalarField1, faceMap: faceMap1, path: path1 } = findBilateralMap({
        geometry: geometry,
        graph,
        qType,
        p: target1Vertex,
        q: sourceVertex,
        logger,
        doFilter: false,
        bucketSize: 5,
    });

    const { scalarField: scalarField2, faceMap: faceMap2, path: path2 } = findBilateralMap({
        geometry: geometry,
        graph,
        qType,
        p: target2Vertex,
        q: sourceVertex,
        logger,
        doFilter: false,
        bucketSize: 5,
    });

    const { path: path3 } = findGeodesicDistance({
        graph,
        qType,
        source: target2Vertex,
        target: target1Vertex,
        logger,
    });

    const boundaryVertices = [...path1, ...path2.reverse(), ...path3];
    const visitedVertices = [];
    const markedVertices = [];
    const queue = [sourceVertex];
    while (queue.length) {
        const initialVertex = queue.shift();
        graph.neighbors(initialVertex).forEach(neighborVertex => {
            if (!visitedVertices.includes(neighborVertex)) {
                visitedVertices.push(neighborVertex);
                if (!boundaryVertices.includes(neighborVertex)) {
                    queue.push(neighborVertex);
                    markedVertices.push(neighborVertex);
                }
            }
        });
    }

    let regionVertices = [...boundaryVertices];
    if (markedVertices.length > geometry.vertices.length - markedVertices.length) {
        geometry.vertices.forEach(vertex => {
            if (!markedVertices.includes(vertex)) {
                regionVertices.push(vertex);
            }
        });
    } else {
        regionVertices = regionVertices.concat(markedVertices);
    }

    const bilateralMap = [];
    geometry.faces.forEach(face => {
        const v1 = geometry.vertices[face.a],
            v2 = geometry.vertices[face.b],
            v3 = geometry.vertices[face.c];

        const hue1 = faceMap1.get(face),
            hue2 = faceMap2.get(face);

        const color = new Color(0xcccccc);

        if (
            scalarField1.get(v1) !== Infinity &&
            scalarField1.get(v2) !== Infinity &&
            scalarField1.get(v3) !== Infinity &&
            scalarField2.get(v1) !== Infinity &&
            scalarField2.get(v2) !== Infinity &&
            scalarField2.get(v3) !== Infinity &&
            regionVertices.includes(v1) &&
            regionVertices.includes(v2) &&
            regionVertices.includes(v3)
        ) {
            let hex;
            if (hue1 % 2 === hue2 % 2 && hue1 % 2 === 0) {
                hex = "ff0000";
            } else if (hue1 % 2 === hue2 % 2 && hue1 % 2 === 1) {
                hex = "ccff00";
            } else if (hue1 % 2 !== hue2 % 2 && hue1 % 2 === 0) {
                hex = "00ff66";
            } else if (hue1 % 2 !== hue2 % 2 && hue1 % 2 === 1) {
                hex = "0066ff";
            }
            color.setHex(parseInt(`0x${hex}`));

            // Calculate the area using Heron's formula
            const e1 = v1.distanceTo(v2),
                e2 = v2.distanceTo(v3),
                e3 = v1.distanceTo(v3);
            const s = (e1 + e2 + e3) / 2.0;
            bilateralMap[hue1 * 1000 + hue2] = {
                x: hue1,
                y: hue2,
                z:
                    ((bilateralMap[hue1 * 1000 + hue2] && bilateralMap[hue1 * 1000 + hue2].z) ||
                        0) + Math.sqrt(s * (s - e1) * (s - e2) * (s - e3)),
                fill: `#${hex}`,
            };
        }

        face.color = color;
    });

    return {
        bilateralMap,
        paths: [path1, path2, path3],
        points: [sourceVertex, target1Vertex, target2Vertex],
    };
}
