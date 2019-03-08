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

export function dijkstra(graph, source, target = undefined) {
    let startTime;

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

    console.log(`\t\tdone in ${new Date() - startTime}ms.`);

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

    console.log(`\t\tdone in ${new Date() - startTime}ms.`);

    // 22
    // 23      return dist[], prev[]
    return {
        distance,
        previous,
    };
}
