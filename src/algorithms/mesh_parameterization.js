export function generateMeshParameterization({ geometry, graph, logger }) {
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Finding boundary vertices...`);

    const edgeCounts = new Map();
    geometry.faces.forEach(face => {
        let firstVertexIndex = Math.min(face.a, face.b),
            secondVertexIndex = Math.max(face.a, face.b),
            identifier = `${firstVertexIndex},${secondVertexIndex}`;
        edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);

        firstVertexIndex = Math.min(face.a, face.c);
        secondVertexIndex = Math.max(face.a, face.c);
        identifier = `${firstVertexIndex},${secondVertexIndex}`;
        edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);

        firstVertexIndex = Math.min(face.b, face.c);
        secondVertexIndex = Math.max(face.b, face.c);
        identifier = `${firstVertexIndex},${secondVertexIndex}`;
        edgeCounts.set(identifier, (edgeCounts.get(identifier) || 0) + 1);
    });

    const boundaryEdges = new Set();
    edgeCounts.forEach((count, edge) => {
        if (count === 1) {
            boundaryEdges.add({
                vertices: [
                    geometry.vertices[Number(edge.split(",")[0])],
                    geometry.vertices[Number(edge.split(",")[1])],
                ],
            });
        }
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        boundaryEdges,
    };
}
