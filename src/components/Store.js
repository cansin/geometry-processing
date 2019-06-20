import { action, computed, observable } from "mobx";

import { MODELS } from "../constants";

class Store {
    @observable assignment = "TriangularBilateral";
    @observable model = MODELS.TriangularBilateral.firstNull0;
    @observable qType = "FibonacciHeap";
    @observable vertexSelection = "FarthestPoint";
    @observable vertexCount = 2;
    @observable farthestPointIndices = [];
    @observable sourceVertexIndexAtNullShape = 11093;
    @observable target1VertexIndexAtNullShape = 7928;
    @observable target2VertexIndexAtNullShape = 21839;
    @observable weightApproach = "Uniform";
    @observable boundaryShape = "Circle";
    @observable isMouthFixated = "True";
    @observable logs = "";
    @observable chartData = undefined;
    @observable mesh = undefined;
    @observable graph = undefined;

    @computed
    get sourceVertexIndexPromise() {
        return Promise.resolve(this.sourceVertexIndexAtNullShape);
    }

    @computed
    get target1VertexIndexPromise() {
        return Promise.resolve(this.target1VertexIndexAtNullShape);
    }

    @computed
    get target2VertexIndexPromise() {
        return Promise.resolve(this.target2VertexIndexAtNullShape);
    }

    @action
    setAssignment(value) {
        this.assignment = value;
        this.setModel(Object.values(MODELS[this.assignment])[0]);
        this.qType = "FibonacciHeap";
        this.vertexSelection = "FarthestPoint";
        this.vertexCount = 2;
        this.weightApproach = "Uniform";
        this.boundaryShape = "Circle";
        this.isMouthFixated = "True";
    }

    @action
    setModel(value) {
        this.model = value;
        this.chartData = undefined;
        this.mesh = undefined;
        this.graph = undefined;
        this.farthestPointIndices = [];
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
    setSourceVertexIndex(value) {
        this.sourceVertexIndexAtNullShape = value;
        this.chartData = undefined;
    }

    @action
    setTarget1VertexIndex(value) {
        this.target1VertexIndexAtNullShape = value;
        this.chartData = undefined;
    }

    @action
    setTarget2VertexIndex(value) {
        this.target2VertexIndexAtNullShape = value;
        this.chartData = undefined;
    }

    @action
    setChartData(value) {
        this.chartData = value;
    }

    @action
    setIsMouthFixated(value) {
        this.isMouthFixated = value;
    }

    @action setMesh(value) {
        this.mesh = value;
    }

    @action setGraph(value) {
        this.graph = value;
    }

    @action setFarthestPointIndices(value) {
        this.farthestPointIndices = value;
    }

    @action log(value) {
        this.logs += `${value}\n`;
    }

    @action clear() {
        this.logs = "";
    }
}

export default new Store();
