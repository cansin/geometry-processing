import { Graph } from "algorithms/data_structures";
import { Geometry } from "three";

import { dijkstra } from "./dijkstra";

function vertexToString(v) {
    return `${v.x},${v.y},${v.z}`;
}

export function findShortestPath(mesh) {
    let { geometry } = mesh;
    let startTime;

    startTime = new Date();
    console.log("Creating naive geometry...");

    if (geometry && !geometry.isGeometry) {
        geometry = new Geometry().fromBufferGeometry(geometry);
        geometry.mergeVertices();
    }

    console.log(`\tdone in ${new Date() - startTime}ms.`);

    startTime = new Date();
    console.log(`Adding vertices to the graph...`);

    const { faces, vertices } = geometry;
    const graph = new Graph(false);

    vertices.forEach(v => {
        graph.addVertex(vertexToString(v));
    });

    console.log(`\tdone in ${new Date() - startTime}ms.`);

    startTime = new Date();
    console.log(`Adding edges to the graph...`);

    // Adopted from `three/src/geometries/WireframeGeometry.js:31`
    const keys = ["a", "b", "c"];

    for (let i = 0, l = faces.length; i < l; i++) {
        let face = faces[i];

        for (let j = 0; j < 3; j++) {
            const vertexIndex1 = face[keys[j]];
            const vertexIndex2 = face[keys[(j + 1) % 3]];
            const vertex1 = vertices[Math.min(vertexIndex1, vertexIndex2)];
            const vertex2 = vertices[Math.max(vertexIndex1, vertexIndex2)];

            graph.addEdge(
                vertexToString(vertex1),
                vertexToString(vertex2),
                vertex1.distanceTo(vertex2),
            );
        }
    }

    console.log(`\tdone in ${new Date() - startTime}ms.`);

    startTime = new Date();
    console.log(`Performing Dijkstra...`);

    const source = vertexToString(
        vertices[Math.floor(Math.random() * vertices.length)],
    );
    const target = vertexToString(
        vertices[Math.floor(Math.random() * vertices.length)],
    );

    const { previous, timing } = dijkstra(graph, source, target);

    console.log(`\tdone in ${new Date() - startTime}ms.`);

    startTime = new Date();
    console.log(`Traversing shortest path...`);

    // 1  S ← empty sequence
    // 2  u ← target
    // 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
    // 4      while u is defined:                       // Construct the shortest path with a stack S
    // 5          insert u at the beginning of S        // Push the vertex onto the stack
    // 6          u ← prev[u]                           // Traverse from target to source

    const S = [];
    let u = target;

    if (previous.get(u) || u === source) {
        while (u) {
            S.unshift(u);
            u = previous.get(u);
        }
    }

    console.log(`\tdone in ${new Date() - startTime}ms.`);

    return {
        path: S,
        timing,
    };
}
