import { FibonacciHeap } from "@tyriar/fibonacci-heap";
import BinaryHeap from "@tyriar/binary-heap";

import { Q_TYPES } from "../constants";

import MinSet from "./MinSet";

export function dijkstra({ graph, qType, source, targets = [], logger }) {
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log("Initializing Dijkstra sets...");

    // 1  function Dijkstra(Graph, source):
    // 2
    // 3      create vertex set Q
    let Q;
    switch (Q_TYPES[qType]) {
        case Q_TYPES.Set:
            logger && logger.log("\tUsing a Set.");
            Q = new MinSet();
            break;
        case Q_TYPES.MinHeap:
            logger && logger.log("\tUsing a Min Heap.");
            Q = new BinaryHeap();
            break;
        case Q_TYPES.FibonacciHeap:
            logger && logger.log("\tUsing a Fibonacci Heap.");
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
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    startTime = new Date();
    logger && logger.log(`Finding shortest paths...`);

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
            logger && logger.log(`\tTarget given, exiting early...`);
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
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    // 22
    // 23      return dist[], prev[]
    return {
        distances,
        previous,
        target: u,
    };
}

export function traverse({ distances, previous, source, target, logger }) {
    let startTime, elapsedTime;

    // 1  S ← empty sequence
    // 2  u ← target
    // 3  if prev[u] is defined or u = source:          // Do something only if the vertex is reachable
    // 4      while u is defined:                       // Construct the shortest path with a stack S
    // 5          insert u at the beginning of S        // Push the vertex onto the stack
    // 6          u ← prev[u]                           // Traverse from target to source
    startTime = new Date();
    logger && logger.log(`Traversing shortest path...`);

    const S = [];
    let u = target;

    if (previous.get(u) || u === source) {
        while (u) {
            S.unshift(u);
            u = previous.get(u);
        }
    }

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

    return {
        distance: distances.get(target),
        path: S,
    };
}

export function findGeodesicDistance({ graph, qType, source, target, logger }) {
    const { distances, previous } = dijkstra({ graph, qType, source, targets: [target], logger });

    return traverse({ distances, previous, source, target, logger });
}

export function populateGeodesicDistanceMatrix({ geometry, graph, qType, logger }) {
    const matrix = new Map();

    geometry.vertices.forEach(source => {
        matrix.set(`${source.x}:${source.y}:${source.z}`, new Map());
        const { distances } = dijkstra({ graph, qType, source, logger });

        distances.forEach((distance, target) => {
            matrix
                .get(`${source.x}:${source.y}:${source.z}`)
                .set(`${target.x}:${target.y}:${target.z}`, distance);
        });

        Array.from(matrix.get(`${source.x}:${source.y}:${source.z}`).keys())
            .sort()
            .reduce((accumulator, currentValue) => {
                accumulator[currentValue] = matrix
                    .get(`${source.x}:${source.y}:${source.z}`)
                    .get(currentValue);
                return accumulator;
            }, {});
    });

    Array.from(matrix.keys())
        .sort()
        .reduce((accumulator, currentValue) => {
            accumulator[currentValue] = matrix.get(currentValue);
            return accumulator;
        }, {});

    return {
        matrix,
    };
}
