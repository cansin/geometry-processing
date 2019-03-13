import { dijkstra } from "./geodesic";
import { FibonacciHeap } from "@tyriar/fibonacci-heap";

export function farthestPointSampling(graph, source, count) {
    const { distances } = dijkstra(graph, source);
    const allDistances = new Set([distances]);

    const farthestPoints = new Set();

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
        allDistances.add(dijkstra(graph, point).distances);

        farthestPoints.add(point);
    }

    return {
        farthestPoints,
    };
}
