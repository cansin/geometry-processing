import { dijkstra, traverse } from "./geodesic_distance";

export function generateMeshParameterization({ graph, qType, source, target, logger }) {
    const { distances, previous } = dijkstra({ graph, qType, source, targets: [target], logger });

    return traverse({ distances, previous, source, target, logger });
}
