import { dijkstra, findGeodesicDistance } from "./geodesic";

export function findBilateralMap(graph, p, q) {
    const { path } = findGeodesicDistance(graph, p, q);

    const G = new Map();
    let minDistance = Infinity,
        maxDistance = 0;

    let startTime, elapsedTime;

    startTime = new Date();
    console.log(`Finding Fuzzy Geodesic Scalar Field...`);

    graph.vertices.forEach(x => {
        const { distances, target } = dijkstra(graph, x, path, false);
        const distance = distances.get(target);

        minDistance = Math.min(distance, minDistance);
        maxDistance = Math.max(distance, maxDistance);

        G.set(x, distances.get(target));
    });

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        path,
        scalarField: G,
        minDistance,
        maxDistance,
    };
}
