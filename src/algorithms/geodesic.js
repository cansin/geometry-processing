import { FibonacciHeap } from "@tyriar/fibonacci-heap";
import BinaryHeap from "@tyriar/binary-heap";
import MinSet from "./MinSet";
import { Q_TYPES } from "../components/Store";

export function dijkstra(graph, source, targets = [], logs = true, qType = "FibonacciHeap") {
    if (!(targets instanceof Array)) {
        targets = [targets];
    }

    let startTime, elapsedTime;

    startTime = new Date();
    logs && console.log("Initializing Dijkstra sets...");

    // 1  function Dijkstra(Graph, source):
    // 2
    // 3      create vertex set Q
    let Q;
    switch (Q_TYPES[qType]) {
        case Q_TYPES.Set:
            logs && console.log("\tUsing a Set.");
            Q = new MinSet();
            break;
        case Q_TYPES.MinHeap:
            logs && console.log("\tUsing a Min Heap.");
            Q = new BinaryHeap();
            break;
        case Q_TYPES.FibonacciHeap:
            logs && console.log("\tUsing a Fibonacci Heap.");
            Q = new FibonacciHeap();
            break;
    }

    const distances = new Map();
    const previous = new Map();
    const nodeMapping = new Map();

    // 4
    // 5      for each vertex v in Graph:
    // 6          dist[v] ← INFINITY
    // 7          prev[v] ← UNDEFINED
    // 8          add v to Q
    // 10      dist[source] ← 0
    graph.vertices.forEach(v => {
        const vDistance = v === source ? 0 : Infinity;
        distances.set(v, vDistance);
        previous.set(v, undefined);
        nodeMapping.set(v, Q.insert(vDistance, v));
    });

    elapsedTime = new Date() - startTime;
    logs && console.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    logs && console.log(`Finding shortest paths...`);

    // 11
    // 12      while Q is not empty:
    // 13          u ← vertex in Q with min dist[u]
    // 14
    // 15          remove u from Q
    let u = undefined;
    while (!Q.isEmpty()) {
        const node = Q.extractMinimum();
        u = node.value;

        if (targets.length && targets.includes(u)) {
            logs && console.log(`\tTarget given, exiting early...`);
            break;
        }

        // 16
        // 17          for each neighbor v of u:
        // 18              alt ← dist[u] + length(u, v)
        // 19              if alt < dist[v]:
        // 20                  dist[v] ← alt
        // 21                  prev[v] ← u
        graph.neighbors(u).forEach(v => {
            const alt = distances.get(u) + graph.edge(u, v);
            if (alt < distances.get(v)) {
                Q.decreaseKey(nodeMapping.get(v), alt);
                distances.set(v, alt);
                previous.set(v, u);
            }
        });
    }

    elapsedTime = new Date() - startTime;
    logs && console.log(`\tdone in ${elapsedTime}ms.`);

    // 22
    // 23      return dist[], prev[]
    return {
        distances,
        previous,
        target: u,
    };
}

export function traverse(distances, previous, source, target, logs = true) {
    let startTime, elapsedTime;

    // 1  S ← empty sequence
    // 2  u ← target
    // 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
    // 4      while u is defined:                       // Construct the shortest path with a stack S
    // 5          insert u at the beginning of S        // Push the vertex onto the stack
    // 6          u ← prev[u]                           // Traverse from target to source
    startTime = new Date();
    logs && console.log(`Traversing shortest path...`);

    const S = [];
    let u = target;

    if (previous.get(u) || u === source) {
        while (u) {
            S.unshift(u);
            u = previous.get(u);
        }
    }

    elapsedTime = new Date() - startTime;
    logs && console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        distance: distances.get(target),
        path: S,
    };
}

export function findGeodesicDistance(graph, source, target, logs = true, qType = "FibonacciHeap") {
    const { distances, previous } = dijkstra(graph, source, target, logs, qType);

    return traverse(distances, previous, source, target);
}
