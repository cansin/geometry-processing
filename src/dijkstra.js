import { dijkstra } from "algorithms/graph";
import { Graph } from "algorithms/data_structures";
import { Geometry } from "three";

function vertexToString(v) {
    return `${v.x},${v.y},${v.z}`;
}

export default function findShortestPath(mesh) {
    let geometry = mesh.geometry;

    if (geometry && !geometry.isGeometry) {
        geometry = new Geometry.fromBufferGeometry(geometry);
    }

    const vertices = geometry.vertices;
    const graph = new Graph(false);

    vertices.forEach(v => {
        graph.addVertex(vertexToString(v));
    });

    // Adopted from three/src/geometries/WireframeGeometry.js:31

    const keys = ["a", "b", "c"];

    let faces = geometry.faces;
    for (let i = 0, l = faces.length; i < l; i++) {
        let face = faces[i];

        for (let j = 0; j < 3; j++) {
            const vertexIndex1 = face[keys[j]];
            const vertexIndex2 = face[keys[(j + 1) % 3]];

            graph.addEdge(
                vertexToString(vertices[Math.min(vertexIndex1, vertexIndex2)]),
                vertexToString(vertices[Math.max(vertexIndex1, vertexIndex2)]),
            );
        }
    }

    const source = geometry.vertices[0];

    console.log(graph);

    const result = dijkstra(graph, vertexToString(source));

    // 1  S ← empty sequence
    // 2  u ← target
    // 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
    // 4      while u is defined:                       // Construct the shortest path with a stack S
    // 5          insert u at the beginning of S        // Push the vertex onto the stack
    // 6          u ← prev[u]                           // Traverse from target to source

    

    console.log(result);
}

// import { Geometry } from "three";
//
// function getGraph(geometry) {
//     if (geometry && !geometry.isGeometry) {
//         geometry = new Geometry.fromBufferGeometry(geometry);
//     }
//
//     // Adopted from three/src/geometries/WireframeGeometry.js:31
//
//     const edges = new Set();
//     const keys = ["a", "b", "c"];
//
//     let faces = geometry.faces;
//     for (let i = 0, l = faces.length; i < l; i++) {
//         let face = faces[i];
//
//         for (let j = 0; j < 3; j++) {
//             const edge1 = face[keys[j]];
//             const edge2 = face[keys[(j + 1) % 3]];
//
//             edges.add(
//                 new Set([Math.min(edge1, edge2), Math.max(edge1, edge2)]),
//             );
//         }
//     }
//
//     return {
//         edges,
//         vertices: geometry.vertices,
//     };
// }
//
// function findMinDistant(Q, dist) {
//     let u = undefined;
//     let minDistance = Infinity;
//
//     Q.forEach(v => {
//         // console.log(v, dist.get(v), minDistance);
//         if (dist.get(v) < minDistance) {
//             minDistance = dist.get(v);
//             u = v;
//         }
//     });
//
//     return u;
// }
//
// export default function dijkstra(mesh) {
//     console.log("Mesh", mesh);
//
//     const Graph = getGraph(mesh.geometry);
//     const source = Graph.vertices[0];
//     // const target = Graph[Graph.length - 1];
//
//     // 1  function Dijkstra(Graph, source):
//     // 2
//     // 3      create vertex set Q
//     // 4
//     // 5      for each vertex v in Graph:
//     // 6          dist[v] ← INFINITY
//     // 7          prev[v] ← UNDEFINED
//     // 8          add v to Q
//     // 10     dist[source] ← 0
//
//     const Q = new Set(),
//         dist = new Map(),
//         prev = new Map();
//
//     Graph.vertices.forEach(v => {
//         dist.set(v, Infinity);
//         prev.set(v, undefined);
//         Q.add(v);
//     });
//
//     dist.set(source, 0);
//
//     // 11
//     // 12      while Q is not empty:
//     // 13          u ← vertex in Q with min dist[u]
//     // 14
//     // 15          remove u from Q
//     // 16
//     // 17          for each neighbor v of u:
//     // 18              alt ← dist[u] + length(u, v)
//     // 19              if alt < dist[v]:
//     // 20                  dist[v] ← alt
//     // 21                  prev[v] ← u
//     // 22
//     // 23      return dist[], prev[]
//     while (Q.size) {
//         const u = findMinDistant(Q, dist);
//
//         Q.delete(u);
//     }
//
//     console.log(dist, prev);
//
//     // 1  S ← empty sequence
//     // 2  u ← target
//     // 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
//     // 4      while u is defined:                       // Construct the shortest path with a stack S
//     // 5          insert u at the beginning of S        // Push the vertex onto the stack
//     // 6          u ← prev[u]                           // Traverse from target to source
//
//     // const S = [];
//     // let u = target;
//     //
//     // console.log(prev, dist);
//     //
//     // if (prev[u] || u === source) {
//     //     while (u) {
//     //         S.unshift(u);
//     //         u = prev[u];
//     //     }
//     // }
//     //
//     // console.log("Shortest Path", S);
//     //
//     // return S;
// }
