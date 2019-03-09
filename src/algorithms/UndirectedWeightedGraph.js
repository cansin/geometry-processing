export default class UndirectedWeightedGraph {
    constructor() {
        this.edges = new Map();
        this.vertices = new Set();
    }

    addVertex(v) {
        if (this.vertices.has(v)) {
            throw new Error(`Vertex ${v} has already been added`);
        }
        this.vertices.add(v);
        this.edges.set(v, new Map());
    }

    addEdge(v1, v2, weight) {
        if (!this.edges.get(v1)) {
            this.addVertex(v1);
        }

        if (!this.edges.get(v2)) {
            this.addVertex(v2);
        }

        this.edges.get(v1).set(v2, weight);
        this.edges.get(v2).set(v1, weight);
    }

    neighbors(v) {
        return Array.from(this.edges.get(v).keys());
    }

    edge(v1, v2) {
        return this.edges.get(v1).get(v2);
    }
}
