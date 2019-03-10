import { dijkstra, traverse } from "./geodesic";

export function findBilateralMap(graph, p, q) {
    const { distances: distancesP, previous: previousP } = dijkstra(graph, p);
    const { distances: distancesQ, previous: previousQ } = dijkstra(graph, q);
    const { distance: distancePQ, path: pathPQ } = traverse(distancesP, previousP, p, q);

    const G = new Map();
    let minDistance = Infinity,
        maxDistance = 0;

    let startTime, elapsedTime;

    startTime = new Date();
    console.log(`Finding Fuzzy Geodesic Scalar Field...`);

    graph.vertices.forEach(x => {
        const distance =
            Math.abs(distancesP.get(x) + distancesQ.get(x) - distancesP.get(q)) / distancePQ;

        minDistance = Math.min(distance, minDistance);
        maxDistance = Math.max(distance, maxDistance);

        G.set(x, distance > 0.3 ? Infinity : distance);
    });

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    console.log(`Calculating initial region...`);

    G.forEach((distance, x) => {
        if (distance > 0.3) {
            G.set(x, Infinity);
        }
    });

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    console.log(`Calculating filtering region...`);

    G.forEach((distance, x) => {
        if (distancesP.get(x) > distancePQ || distancesQ.get(x) > distancePQ) {
            G.set(x, Infinity);
        }
    });

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        path: pathPQ,
        scalarField: G,
        minDistance,
        maxDistance,
    };
}
