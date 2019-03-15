import { action, computed, observable } from "mobx";
import autobind from "autobind-decorator";
import { ASSIGNMENTS, MODELS } from "../constants";

class Store {
    @observable assignment = "Geodesic";
    @observable model = MODELS.Geodesic.horse0;
    @observable qType = "FibonacciHeap";
    @observable timing = undefined;
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
        this.timing = undefined;
    }

    @action
    setModel(value) {
        this.model = value;
        this.timing = undefined;
    }

    @action
    setQType(value) {
        this.qType = value;
    }

    @action
    setVertexSelection(value) {
        this.vertexSelection = value;
    }

    @autobind
    @action
    setTiming(value) {
        this.timing = value;
    }

    @action
    log(value) {
        console.log(value);
    }

    @action
    clear() {
        console.clear();
    }
}

export default new Store();
