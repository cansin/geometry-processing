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

        if (G.get(v1) !== Infinity && G.get(v2) !== Infinity && G.get(v3) !== Infinity) {
            const distance1 = (distancesP.get(v1) * 20.0) / distancePQ,
                distance2 = (distancesP.get(v2) * 20.0) / distancePQ,
                distance3 = (distancesP.get(v3) * 20.0) / distancePQ,
                hue = Math.floor((distance1 + distance2 + distance3) / 3.0);

            color.setHSL((1 - (hue % 2)) * (2.0 / 3.0), 1.0, 0.5);

            // Calcuate the area using Heron's formula
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

    const {
        allGeodesics: allGeodesics1,
        distance: pathDistance1,
        path: path1,
    } = findNearestNeighbors({
        graph,
        qType,
        logger,
        points,
    });

    const {
        allGeodesics: allGeodesics2,
        distance: pathDistance2,
        path: path2,
    } = findNearestNeighbors({
        graph,
        qType,
        logger,
        points: [path1[path1.length - 1], path1[0]],
    });

    const allGeodesics = new Map([...allGeodesics1, ...allGeodesics2]);
    const pathDistance = pathDistance1 + pathDistance2;
    const path = [...path1, ...path2];

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
        distance =
            (distance / (allGeodesics.size - 1) - pathDistance / allGeodesics.size) /
            (pathDistance / allGeodesics.size);

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
        if (
            distancesToSource.get(x) > pathDistance / allGeodesics.size ||
            distancesToSource.get(x) > pathDistance / allGeodesics.size
        ) {
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

        if (G.get(v1) !== Infinity && G.get(v2) !== Infinity && G.get(v3) !== Infinity) {
            const distance1 =
                    (distancesToSource.get(v1) * 20.0) / (pathDistance / allGeodesics.size),
                distance2 = (distancesToSource.get(v2) * 20.0) / (pathDistance / allGeodesics.size),
                distance3 = (distancesToSource.get(v3) * 20.0) / (pathDistance / allGeodesics.size),
                hue = Math.floor((distance1 + distance2 + distance3) / 3.0);

            color.setHSL((1 - (hue % 2)) * (2.0 / 3.0), 1.0, 0.5);

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
        }

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
