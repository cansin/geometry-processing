import { Color } from "three";

import { dijkstra, traverse } from "./geodesic_distance";
import { farthestPointSampling } from "./farthest_point_sampling";
import { findNearestNeighbors } from "./nearest_neighbor";

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
        const distance = Math.abs(distancesP.get(x) + distancesQ.get(x) - distancePQ) / distancePQ;

        minDistance = Math.min(distance, minDistance);
        maxDistance = Math.max(distance, maxDistance);

        G.set(x, distance);
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

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

    startTime = new Date();
    logger && logger.log(`Divide the ROI into bins...`);

    const bilateralMap = [];
    geometry.faces.forEach(face => {
        const v1 = geometry.vertices[face.a],
            v2 = geometry.vertices[face.b],
            v3 = geometry.vertices[face.c];

        const color = new Color(0xcccccc);

        const distance1 = G.get(v1),
            distance2 = G.get(v1),
            distance3 = G.get(v1),
            hue = (distance1 + distance2 + distance3) / 3.0;

        color.setHSL(hue, 0.5, 0.5);

        // Calculate the area using Heron's formula
        const e1 = v1.distanceTo(v2),
            e2 = v2.distanceTo(v3),
            e3 = v1.distanceTo(v3);
        const s = (e1 + e2 + e3) / 2.0;
        bilateralMap[hue] = {
            name: hue,
            value:
                ((bilateralMap[hue] && bilateralMap[hue].value) || 0) +
                Math.sqrt(s * (s - e1) * (s - e2) * (s - e3)),
        };

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
    };
}

export function findMultiSeedBilateralMap({ geometry, graph, qType, logger, vertexCount = 3 }) {
    const { vertices } = geometry;
    const { farthestPoints: points } = farthestPointSampling({
        graph,
        qType,
        source: vertices[0],
        count: vertexCount,
        logger,
    });

    const { allGeodesics, distance: pathDistance, path } = findNearestNeighbors({
        graph,
        qType,
        logger,
        points,
    });

    const source = path[0];
    const distancesToSource = allGeodesics.get(source).distances;

    const G = new Map();
    let minDistance = Infinity,
        maxDistance = 0;

    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding Fuzzy Geodesic Scalar Field...`);

    graph.vertices.forEach(x => {
        let distance = 0;
        allGeodesics.forEach(({ distances }) => {
            distance += distances.get(x);
        });
        distance = Math.abs((distance - pathDistance) / pathDistance);

        minDistance = Math.min(distance, minDistance);
        maxDistance = Math.max(distance, maxDistance);

        G.set(x, distance);
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

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
        if (distancesToSource.get(x) > pathDistance || distancesToSource.get(x) > pathDistance) {
            G.set(x, Infinity);
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Divide the ROI into bins...`);

    const bilateralMap = [];
    geometry.faces.forEach(face => {
        const v1 = geometry.vertices[face.a],
            v2 = geometry.vertices[face.b],
            v3 = geometry.vertices[face.c];

        const color = new Color(0xcccccc);

        const distance1 = G.get(v1),
            distance2 = G.get(v2),
            distance3 = G.get(v3),
            hue = (distance1 + distance2 + distance3) / 3.0;

        color.setHSL(hue, 0.5, 0.5);

        // Calculate the area using Heron's formula
        const e1 = v1.distanceTo(v2),
            e2 = v2.distanceTo(v3),
            e3 = v1.distanceTo(v3);
        const s = (e1 + e2 + e3) / 2.0;
        bilateralMap[hue] = {
            name: hue,
            value:
                ((bilateralMap[hue] && bilateralMap[hue].value) || 0) +
                Math.sqrt(s * (s - e1) * (s - e2) * (s - e3)),
        };

        face.color = color;
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        path,
        points,
        scalarField: G,
        minDistance,
        maxDistance,
        bilateralMap,
    };
}
