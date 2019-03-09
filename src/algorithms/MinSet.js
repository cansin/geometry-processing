export default class MinSet {
    constructor() {
        this.Q = new Set();
        this.distance = new Map();
    }

    decreaseKey({ value }, newKey) {
        this.distance.set(value, newKey);
    }

    extractMinimum() {
        const u = this.findMinimum();

        this.Q.delete(u.value);

        return u;
    }

    findMinimum() {
        let u = undefined;
        let minDistance = Infinity;

        this.Q.forEach(v => {
            const vDistance = this.distance.get(v);
            if (vDistance < minDistance) {
                minDistance = vDistance;
                u = v;
            }
        });

        return {
            key: minDistance,
            value: u,
        };
    }

    insert(key, value) {
        this.distance.set(value, key);
        this.Q.add(value);

        return {
            key,
            value,
        };
    }

    isEmpty() {
        return !this.Q.size;
    }
}
