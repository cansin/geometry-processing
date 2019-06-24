import { FibonacciHeap } from "@tyriar/fibonacci-heap";

import store from "../components/Store";

import { dijkstra } from "./geodesic_distance";

export const farthestPointSampling = (qType, source, count) => {
    const logger = store;
    const { graph, mesh } = store;
    const { geometry } = mesh;
    const { distances } = dijkstra(qType, source);
    const allDistances = new Set([distances]);

    const farthestPoints = [];
    const farthestPointIndices = [];

    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Executing Farthest Point Sampling...`);

    for (let i = 0; i < count; i++) {
        const cluster = new FibonacciHeap();

        graph.vertices.forEach(vertex => {
            let minDistance = Infinity;

            allDistances.forEach(distances => {
                const distance = distances.get(vertex);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            });

            cluster.insert(-minDistance, vertex);
        });

        const point = cluster.extractMinimum().value;
        if (i === 0) {
            allDistances.clear();
        }
        allDistances.add(dijkstra(qType, point).distances);

        farthestPoints.push(point);
    }

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    farthestPoints.forEach(point => {
        geometry.vertices.forEach((vertex, index) => {
            if (vertex === point) {
                farthestPointIndices.push(index);
            }
        });
    });

    return {
        farthestPoints,
        farthestPointIndices,
    };
};
