function findMinDistant(Q, distance) {
    let u = undefined;
    let minDistance = Infinity;

    Q.forEach(v => {
        const vDistance = distance.get(v);
        if (vDistance < minDistance) {
            minDistance = vDistance;
            u = v;
        }
    });

    return u;
}

function dijkstra(graph, source, target = undefined) {
    let startTime,
        elapsedTime,
        totalTime = 0;

    startTime = new Date();
    console.log("\tInitializing Dijkstra sets...");

    // 1  function Dijkstra(Graph, source):
    // 2
    // 3      create vertex set Q
    const Q = new Set();
    const distance = new Map();
    const previous = new Map();

    // 4
    // 5      for each vertex v in Graph:
    // 6          dist[v] ← INFINITY
    // 7          prev[v] ← UNDEFINED
    // 8          add v to Q
    // 10      dist[source] ← 0
    graph.vertices.forEach(v => {
        distance.set(v, Infinity);
        previous.set(v, undefined);
        Q.add(v);
    });

    distance.set(source, 0);

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
    while (Q.size) {
        u = findMinDistant(Q, distance);

        Q.delete(u);

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

export function findGeodesicDistance(graph, source, target) {
    const { previous, timing: dijkstraTime } = dijkstra(graph, source, target);

    const { S, timing: traverseTime } = traverse(previous, source, target);

    return {
        path: S,
        timing: dijkstraTime + traverseTime,
    };
}
