import { FibonacciHeap } from "@tyriar/fibonacci-heap";
import BinaryHeap from "@tyriar/binary-heap";
import MinSet from "./MinSet";
import { Q_TYPES } from "../components/Store";

export function dijkstra(
    graph,
    source,
    target = undefined,
    qType = "FibonacciHeap",
) {
    let startTime,
        elapsedTime,
        totalTime = 0;

    startTime = new Date();
    console.log("\tInitializing Dijkstra sets...");

    // 1  function Dijkstra(Graph, source):
    // 2
    // 3      create vertex set Q
    let Q;
    switch (Q_TYPES[qType]) {
        case Q_TYPES.Set:
            console.log("\t\tUsing a Set.");
            Q = new MinSet();
            break;
        case Q_TYPES.MinHeap:
            console.log("\t\tUsing a Min Heap.");
            Q = new BinaryHeap();
            break;
        case Q_TYPES.FibonacciHeap:
            console.log("\t\tUsing a Fibonacci Heap.");
            Q = new FibonacciHeap();
            break;
    }

    const distance = new Map();
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
        distance.set(v, vDistance);
        previous.set(v, undefined);
        nodeMapping.set(v, Q.insert(vDistance, v));
    });

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    console.log(`\tFinding shortest paths...`);

    // 11
    // 12      while Q is not empty:
    // 13          u ← vertex in Q with min dist[u]
    // 14
    // 15          remove u from Q
    let u = undefined;
    while (!Q.isEmpty()) {
        const node = Q.extractMinimum();
        u = node.value;

        if (target && u === target) {
            console.log(`\t\tTarget given, exiting early...`);
            break;
        }

        // 16
        // 17          for each neighbor v of u:
        // 18              alt ← dist[u] + length(u, v)
        // 19              if alt < dist[v]:
        // 20                  dist[v] ← alt
        // 21                  prev[v] ← u
        graph.neighbors(u).forEach(v => {
            const alt = distance.get(u) + graph.edge(u, v);
            if (alt < distance.get(v)) {
                Q.decreaseKey(nodeMapping.get(v), alt);
                distance.set(v, alt);
                previous.set(v, u);
            }
        });
    }

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    // 22
    // 23      return dist[], prev[]
    return {
        distance,
        previous,
        timing: totalTime,
    };
}

function traverse(previous, source, target) {
    let startTime,
        elapsedTime,
        totalTime = 0;

    // 1  S ← empty sequence
    // 2  u ← target
    // 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
    // 4      while u is defined:                       // Construct the shortest path with a stack S
    // 5          insert u at the beginning of S        // Push the vertex onto the stack
    // 6          u ← prev[u]                           // Traverse from target to source
    startTime = new Date();
    console.log(`Traversing shortest path...`);

    const S = [];
    let u = target;

    if (previous.get(u) || u === source) {
        while (u) {
            S.unshift(u);
            u = previous.get(u);
        }
    }

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        S,
        timing: totalTime,
    };
}

export function findGeodesicDistance(graph, source, target, qType) {
    const { previous, timing: dijkstraTime } = dijkstra(
        graph,
        source,
        target,
        qType,
    );

    const { S, timing: traverseTime } = traverse(previous, source, target);

    return {
        path: S,
        timing: dijkstraTime + traverseTime,
    };
}
