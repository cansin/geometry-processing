export default class Graph {
    constructor() {
        this.adjList = new Map();
        this.vertices = new Set();
    }

    addVertex(v) {
        if (this.vertices.has(v)) {
            throw new Error(`Vertex ${v} has already been added`);
        }
        this.vertices.add(v);
        this.adjList.set(v, new Map());
    }

    addEdge(a, b, w) {
        // If no weight is assigned to the edge, 1 is the default
        w = w === undefined ? 1 : w;

        if (!this.adjList.get(a)) {
            this.addVertex(a);
        }

        if (!this.adjList.get(b)) {
            this.addVertex(b);
        }

        // If there's already another edge with the same origin and destination
        // sum with the current one
        this.adjList.get(a).set(b, (this.adjList.get(a).get(b) || 0) + w);
        this.adjList.get(b).set(a, (this.adjList.get(b).get(a) || 0) + w);
    }

    neighbors(v) {
        return Array.from(this.adjList.get(v).keys());
    }

    edge(a, b) {
        return this.adjList.get(a).get(b);
    }
}
