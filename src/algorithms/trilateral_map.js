import { Color } from "three";

import { BILATERAL_BUCKET_SIZE } from "../constants";

import { findBilateralMap } from "./bilateral_map";

export function findTrilateralMap({
    geometry,
    graph,
    qType,
    logger,
    sourceVertexIndex,
    target1VertexIndex,
    target2VertexIndex,
}) {
    const bucketSize = BILATERAL_BUCKET_SIZE;
    const { vertices } = geometry;
    const sourceVertex = vertices[sourceVertexIndex],
        target1Vertex = vertices[target1VertexIndex],
        target2Vertex = vertices[target2VertexIndex];
    const { scalarField: scalarField1, faceMap: faceMap1, path: path1 } = findBilateralMap({
        geometry: geometry,
        graph,
        qType,
        p: vertices[target1VertexIndex],
        q: vertices[sourceVertexIndex],
        bucketSize,
        logger,
    });

    const { scalarField: scalarField2, faceMap: faceMap2, path: path2 } = findBilateralMap({
        geometry: geometry,
        graph,
        qType,
        p: vertices[target2VertexIndex],
        q: vertices[sourceVertexIndex],
        bucketSize,
        logger,
    });

    const bilateralMap = [];
    geometry.faces.forEach((face) => {
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
            hue1 < bucketSize &&
            hue2 < bucketSize
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
        paths: [path1, path2],
        points: [sourceVertex, target1Vertex, target2Vertex],
    };
}
