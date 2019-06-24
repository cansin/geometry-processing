import { Color } from "three";

import { dijkstra, traverse } from "./geodesic_distance";

export function findBilateralMap({
    geometry,
    graph,
    qType,
    p,
    q,
    logger,
    doFilter = true,
    bucketSize = 20.0,
}) {
    const { distances: distancesP, previous: previousP } = dijkstra(qType, p);
    const { distances: distancesQ, previous: previousQ } = dijkstra(qType, q);
    const { distance: distancePQ, path: pathPQ } = traverse(distancesP, previousP, p, q);

    const G = new Map();
    let minDistance = Infinity,
        maxDistance = 0;

    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding Fuzzy Geodesic Scalar Field...`);

    graph.vertices.forEach(x => {
        const distance = Math.abs(distancesP.get(x) + distancesQ.get(x) - distancePQ) / distancePQ;

        minDistance = Math.min(distance, minDistance);
        maxDistance = Math.max(distance, maxDistance);

        G.set(x, distance);
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    if (doFilter) {
        startTime = new Date();
        logger && logger.log(`Calculating initial region...`);

        G.forEach((distance, x) => {
            if (distance > 0.3) {
                G.set(x, Infinity);
            }
        });

        elapsedTime = new Date() - startTime;
        logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

        startTime = new Date();
        logger && logger.log(`Calculating filtering region...`);

        G.forEach((distance, x) => {
            if (distancesP.get(x) > distancePQ || distancesQ.get(x) > distancePQ) {
                G.set(x, Infinity);
            }
        });

        elapsedTime = new Date() - startTime;
        logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);
    }

    startTime = new Date();
    logger && logger.log(`Divide the ROI into bins...`);

    const bilateralMap = [];
    const faceMap = new Map();
    geometry.faces.forEach(face => {
        const v1 = geometry.vertices[face.a],
            v2 = geometry.vertices[face.b],
            v3 = geometry.vertices[face.c];

        const color = new Color(0xcccccc);

        if (G.get(v1) !== Infinity && G.get(v2) !== Infinity && G.get(v3) !== Infinity) {
            const distance1 = (distancesP.get(v1) * bucketSize) / distancePQ,
                distance2 = (distancesP.get(v2) * bucketSize) / distancePQ,
                distance3 = (distancesP.get(v3) * bucketSize) / distancePQ,
                hue = Math.floor((distance1 + distance2 + distance3) / 3.0);

            color.setHSL((1 - (hue % 2)) * (2.0 / 3.0), 1.0, 0.5);

            // Calculate the area using Heron's formula
            const e1 = v1.distanceTo(v2),
                e2 = v2.distanceTo(v3),
                e3 = v1.distanceTo(v3);
            const s = (e1 + e2 + e3) / 2.0;
            bilateralMap[hue] = {
                x: hue,
                y:
                    ((bilateralMap[hue] && bilateralMap[hue].y) || 0) +
                    Math.sqrt(s * (s - e1) * (s - e2) * (s - e3)),
            };

            faceMap.set(face, hue);
        }

        face.color = color;
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        path: pathPQ,
        scalarField: G,
        minDistance,
        maxDistance,
        bilateralMap,
        faceMap,
        distancesP,
        distancesQ,
        previousP,
        previousQ,
        distancePQ,
    };
}
