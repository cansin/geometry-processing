import { dijkstra, traverse } from "./geodesic_distance";

export function findNearestNeighbors({ graph, qType, logger, points }) {
    const visited = [points[0]];

    const allGeodesics = new Map();
    const path = [];
    let distance = 0;

    while (visited.length !== points.length) {
        const source = visited[visited.length - 1];
        const { distances, previous } = dijkstra(qType, source);

        let closestTarget = undefined;
        let closestDistance = Infinity;
        points.forEach(target => {
            const targetDistance = distances.get(target);
            if (targetDistance < closestDistance && !visited.includes(target)) {
                closestDistance = targetDistance;
                closestTarget = target;
            }
        });

        const { path: closestPath } = traverse(distances, previous, source, closestTarget);

        path.push(...closestPath);
        visited.push(closestTarget);
        distance += closestDistance;
        allGeodesics.set(source, { distances, previous });
    }

    allGeodesics.set(
        visited[visited.length - 1],
        dijkstra({
            graph,
            qType,
            source: visited[visited.length - 1],
            logger,
        }),
    );

    return {
        allGeodesics,
        distance,
        path,
    };
}
