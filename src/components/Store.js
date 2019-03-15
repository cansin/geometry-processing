import { action, computed, observable } from "mobx";

import { ASSIGNMENTS, MODELS } from "../constants";

class Store {
    @observable assignment = "Geodesic";
    @observable model = MODELS.Geodesic.horse0;
    @observable qType = "FibonacciHeap";
    @observable vertexSelection = "FarthestPoint";
    @observable logs = "";
    @observable chartData = undefined;

    @computed get vertexCount() {
        return ASSIGNMENTS[this.assignment] === ASSIGNMENTS.Bilateral ? 100 : 2;
    }

    @action
    setAssignment(value) {
        this.assignment = value;
        this.model = Object.values(MODELS[this.assignment])[0];
        this.qType = "FibonacciHeap";
        this.vertexSelection = "FarthestPoint";
        this.chartData = undefined;
    }

    @action
    setModel(value) {
        this.model = value;
        this.chartData = undefined;
    }

    @action
    setQType(value) {
        this.qType = value;
        this.chartData = undefined;
    }

    @action
    setVertexSelection(value) {
        this.vertexSelection = value;
        this.chartData = undefined;
    }

    @action
    setChartData(value) {
        this.chartData = value;
    }

    @action
    log(value) {
        this.logs += `${value}\n`;
    }

    @action
    clear() {
        this.logs = "";
    }
}

export default new Store();
