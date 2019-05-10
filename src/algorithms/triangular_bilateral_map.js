import { Color } from "three";

import { farthestPointSampling } from "./farthest_point_sampling";
import { findBilateralMap } from "./bilateral_map";

export function findTriangularBilateralMap({ geometry, graph, qType, logger }) {
    const { vertices } = geometry;
    const { farthestPoints: points } = farthestPointSampling({
        graph,
        qType,
        source: vertices[0],
        count: 3,
        logger,
    });

    const source = points[0],
        target1 = points[1],
        target2 = points[2];

    const { scalarField: scalarField1, faceMap: faceMap1, path: path1 } = findBilateralMap({
        geometry: geometry,
        graph,
        qType,
        p: target1,
        q: source,
        logger,
    });

    const { scalarField: scalarField2, faceMap: faceMap2, path: path2 } = findBilateralMap({
        geometry: geometry,
        graph,
        qType,
        p: target2,
        q: source,
        logger,
    });

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
            scalarField2.get(v3) !== Infinity
        ) {
            if (hue1 % 2 === hue2 % 2 && hue1 % 2 === 0) {
                color.setHSL(0, 1.0, 0.5);
            } else if (hue1 % 2 === hue2 % 2 && hue1 % 2 === 1) {
                color.setHSL(0.2, 1.0, 0.5);
            } else if (hue1 % 2 !== hue2 % 2 && hue1 % 2 === 0) {
                color.setHSL(0.4, 1.0, 0.5);
            } else if (hue1 % 2 !== hue2 % 2 && hue1 % 2 === 1) {
                color.setHSL(0.6, 1.0, 0.5);
            }
        }

        face.color = color;
    });

    return {
        paths: [path1, path2],
        points,
    };
}
