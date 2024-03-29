import { action, computed, observable } from "mobx";

import { MODELS } from "../constants";

class Store {
    @observable assignment = "Trilateral";
    @observable model = MODELS.Trilateral.firstNull0;
    @observable qType = "FibonacciHeap";
    @observable vertexSelection = "Random";
    @observable vertexCount = 2;
    @observable farthestPointIndices = [];
    @observable bilateralDescriptor = undefined;
    @observable sourceVertexIndexAtNullShape = 11193;
    @observable target1VertexIndexAtNullShape = 10282;
    @observable target2VertexIndexAtNullShape = 8416;
    @observable weightApproach = "Uniform";
    @observable boundaryShape = "Circle";
    @observable isMouthFixated = "True";
    @observable logs = "";
    @observable chartData = undefined;
    @observable mesh = undefined;
    @observable graph = undefined;
    @observable submitCount = 0;

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
        this.mesh = undefined;
        this.graph = undefined;
        this.farthestPointIndices = [];
        this.bilateralDescriptor = undefined;
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
    }

    @action
    setSourceVertexIndex(value) {
        this.sourceVertexIndexAtNullShape = value;
    }

    @action
    setTarget1VertexIndex(value) {
        this.target1VertexIndexAtNullShape = value;
    }

    @action
    setTarget2VertexIndex(value) {
        this.target2VertexIndexAtNullShape = value;
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

    @action setBilateralDescriptor(value) {
        this.bilateralDescriptor = value;
    }

    @action log(value) {
        this.logs += `${value}\n`;
    }

    @action clear() {
        this.logs = "";
    }

    @action submit() {
        this.submitCount++;
        this.chartData = undefined;
    }
}

export default new Store();
