import FastPriorityQueue from "fastpriorityqueue";

export default class MinHeap {
    constructor() {
        this.heap = new FastPriorityQueue((a, b) => a.key < b.key);
    }

    decreaseKey({ value }, newKey) {
        this.heap.removeOne((node) => value === node.value);
        this.heap.add({ key: newKey, value });
    }

    extractMinimum() {
        return this.heap.poll();
    }

    findMinimum() {
        return this.heap.peek();
    }

    insert(key, value) {
        this.heap.add({ key, value });

        return {
            key,
            value,
        };
    }

    isEmpty() {
        return this.heap.isEmpty();
    }
}
