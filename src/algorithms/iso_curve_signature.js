import { dijkstra } from "./geodesic_distance";

export function findIsoCurveSignature({ geometry, graph, qType, source, logger }) {
    const { distances } = dijkstra({ graph, qType, source, logger });
    const maxDistance = Math.max(...distances.values());

    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding Geodesic Iso-Curves...`);

    const isoCurves = new Map();
    for (let i = maxDistance / 20.0; i < maxDistance; i += maxDistance / 20.0) {
        isoCurves.set(i, []);
    }

    geometry.faces.forEach(face => {
        const vertices = [
            geometry.vertices[face.a],
            geometry.vertices[face.b],
            geometry.vertices[face.c],
        ];

        const edges = [
            {
                vertices: [vertices[0], vertices[1]],
                isIntersected: false,
            },
            {
                vertices: [vertices[1], vertices[2]],
                isIntersected: false,
            },
            {
                vertices: [vertices[0], vertices[2]],
                isIntersected: false,
            },
        ];

        isoCurves.forEach((isoCurve, isoDistance) => {
            if (
                Math.min(isoDistance, ...vertices.map(v => distances.get(v))) !== isoDistance &&
                Math.max(isoDistance, ...vertices.map(v => distances.get(v))) !== isoDistance
            ) {
                edges.forEach(edge => {
                    if (
                        (distances.get(edge.vertices[0]) < isoDistance &&
                            distances.get(edge.vertices[1]) > isoDistance) ||
                        (distances.get(edge.vertices[0]) > isoDistance &&
                            distances.get(edge.vertices[1]) < isoDistance)
                    ) {
                        edge.isIntersected = true;
                    }
                });

                edges.forEach(edge => {
                    if (
                        !edge.isIntersected &&
                        distances.get(edge.vertices[0]) < isoDistance &&
                        distances.get(edge.vertices[1]) < isoDistance
                    ) {
                        isoCurve.push(edge);
                    }
                });
            }
        });
    });

    const isoDescriptor = [];
    isoCurves.forEach((isoCurve, isoDistance) => {
        isoDescriptor.push({
            name: isoDistance,
            value: isoCurve.reduce(
                (totalDistance, { vertices }) =>
                    totalDistance + vertices[0].distanceTo(vertices[1]),
                0,
            ),
        });
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        isoCurves,
        isoDescriptor,
    };
}
