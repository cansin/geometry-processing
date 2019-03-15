import { action, computed, observable } from "mobx";

import { ASSIGNMENTS, MODELS } from "../constants";

class Store {
    @observable assignment = "Geodesic";
    @observable model = MODELS.Geodesic.horse0;
    @observable qType = "FibonacciHeap";
    @observable vertexSelection = "FarthestPoint";
    @observable logs = "";

    @computed get vertexCount() {
        return ASSIGNMENTS[this.assignment] === ASSIGNMENTS.Bilateral ? 100 : 2;
    }

    @action
    setAssignment(value) {
        this.assignment = value;
        this.model = Object.values(MODELS[this.assignment])[0];
        this.qType = "FibonacciHeap";
        this.vertexSelection = "FarthestPoint";
    }

    @action
    setModel(value) {
        this.model = value;
    }

    @action
    setQType(value) {
        this.qType = value;
    }

    @action
    setVertexSelection(value) {
        this.vertexSelection = value;
    }

    @action
    log(value) {
        console.log(value);
        this.logs += `${value}\n`;
    }

    @action
    clear() {
        console.clear();
        this.logs = "";
    }
}

export default new Store();
