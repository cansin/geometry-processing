import { Color } from "three";

import { dijkstra, traverse } from "./geodesic_distance";

export function findBilateralMap({ geometry, graph, qType, p, q, logger }) {
    const { distances: distancesP, previous: previousP } = dijkstra({
        graph,
        qType,
        source: p,
        logger,
    });
    const { distances: distancesQ } = dijkstra({ graph, qType, source: q, logger });
    const { distance: distancePQ, path: pathPQ } = traverse({
        distances: distancesP,
        previous: previousP,
        source: p,
        target: q,
        logger,
    });

    const G = new Map();
    let minDistance = Infinity,
        maxDistance = 0;

    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding Fuzzy Geodesic Scalar Field...`);

    graph.vertices.forEach(x => {
        const distance =
            Math.abs(distancesP.get(x) + distancesQ.get(x) - distancesP.get(q)) / distancePQ;

        minDistance = Math.min(distance, minDistance);
        maxDistance = Math.max(distance, maxDistance);

        G.set(x, distance > 0.3 ? Infinity : distance);
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating initial region...`);

    G.forEach((distance, x) => {
        if (distance > 0.3) {
            G.set(x, Infinity);
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    logger && logger.log(`Calculating filtering region...`);

    G.forEach((distance, x) => {
        if (distancesP.get(x) > distancePQ || distancesQ.get(x) > distancePQ) {
            G.set(x, Infinity);
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    logger && logger.log(`Divide the ROI into bins...`);

    geometry.faces.forEach(face => {
        const v1 = geometry.vertices[face.a],
            v2 = geometry.vertices[face.b],
            v3 = geometry.vertices[face.c];

        const color = new Color(0xcccccc);

        if (G.get(v1) !== Infinity && G.get(v2) !== Infinity && G.get(v3) !== Infinity) {
            const distance1 = (distancesP.get(v1) * 20.0) / distancePQ,
                distance2 = (distancesP.get(v2) * 20.0) / distancePQ,
                distance3 = (distancesP.get(v3) * 20.0) / distancePQ,
                hue = Math.floor((distance1 + distance2 + distance3) / 3.0);

            color.setHSL((1 - (hue % 2)) * (2.0 / 3.0), 1.0, 0.5);
        }

        face.color = color;
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    return {
        path: pathPQ,
        scalarField: G,
        minDistance,
        maxDistance,
    };
}
