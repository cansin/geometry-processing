import { dijkstra } from "./geodesic_distance";

export function findIsoCurveSignature(geometry, graph, qType, p) {
    const { distances, previous } = dijkstra(graph, qType, p);

    let startTime, elapsedTime;

    startTime = new Date();
    console.log(`Finding Geodesic Iso-Curves...`);

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        distances,
        previous,
    };
}
