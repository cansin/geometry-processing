import { action, observable } from "mobx";

import { MODELS } from "../constants";

class Store {
    @observable assignment = "MeshParameterization";
    @observable model = MODELS.MeshParameterization.facemLow;
    @observable qType = "FibonacciHeap";
    @observable vertexSelection = "FarthestPoint";
    @observable vertexCount = 2;
    @observable weightApproach = "Uniform";
    @observable boundaryShape = "Free";
    @observable logs = "";
    @observable chartData = undefined;
    @observable mesh = undefined;
    @observable graph = undefined;

    @action
    setAssignment(value) {
        this.assignment = value;
        this.model = Object.values(MODELS[this.assignment])[0];
        this.qType = "FibonacciHeap";
        this.vertexSelection = "FarthestPoint";
        this.vertexCount = 2;
        this.weightApproach = "Uniform";
        this.boundaryShape = "Free";
        this.chartData = undefined;
        this.mesh = undefined;
        this.graph = undefined;
    }

    @action
    setModel(value) {
        this.model = value;
        this.chartData = undefined;
        this.mesh = undefined;
        this.graph = undefined;
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
    setWeightApproach(value) {
        this.weightApproach = value;
    }

    @action
    setBoundaryShape(value) {
        this.boundaryShape = value;
    }

    @action
    setVertexCount(value) {
        this.vertexCount = value;
        this.chartData = undefined;
    }

    @action
    setChartData(value) {
        this.chartData = value;
    }

    @action setMesh(value) {
        this.mesh = value;
    }

    @action setGraph(value) {
        this.graph = value;
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
