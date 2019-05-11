import { action, observable } from "mobx";

import { getModelRef, MODELS, NULL_SHAPE } from "../constants";

class Store {
    @observable assignment = "TriangularBilateral";
    @observable model = MODELS.TriangularBilateral.kid00;
    @observable qType = "FibonacciHeap";
    @observable vertexSelection = "FarthestPoint";
    @observable vertexCount = 2;
    @observable sourceVertexIndexAtNullShape = 0;
    @observable target1VertexIndexAtNullShape = 1000;
    @observable target2VertexIndexAtNullShape = 2000;
    @observable weightApproach = "Uniform";
    @observable boundaryShape = "Circle";
    @observable isMouthFixated = "True";
    @observable logs = "";
    @observable chartData = undefined;
    @observable mesh = undefined;
    @observable graph = undefined;

    get sourceVertexIndexPromise() {
        return this.model !== NULL_SHAPE
            ? getModelRef(this.model).then(
                  module => module.default.get(this.sourceVertexIndexAtNullShape + 1) - 1,
              )
            : Promise.resolve(this.sourceVertexIndexAtNullShape);
    }

    get target1VertexIndexPromise() {
        return this.model !== NULL_SHAPE
            ? getModelRef(this.model).then(
                  module => module.default.get(this.target2VertexIndexAtNullShape + 1) - 1,
              )
            : Promise.resolve(this.target1VertexIndexAtNullShape);
    }

    get target2VertexIndexPromise() {
        return this.model !== NULL_SHAPE
            ? getModelRef(this.model).then(
                  module => module.default.get(this.target2VertexIndexAtNullShape + 1) - 1,
              )
            : Promise.resolve(this.target2VertexIndexAtNullShape);
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
