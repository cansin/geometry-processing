import face from "../meshes/mesh parameterization/face.off";
import faceLow from "../meshes/mesh parameterization/face-low.off";
import facem from "../meshes/mesh parameterization/facem.off";
import facemLow from "../meshes/mesh parameterization/facem-low.off";
import kid00 from "../meshes/kid00.off";
import kid01 from "../meshes/kid01.off";
import kid02 from "../meshes/kid02.off";
import kid03 from "../meshes/kid03.off";
import kid04 from "../meshes/kid04.off";
import kid05 from "../meshes/kid05.off";
import kid06 from "../meshes/kid06.off";
import kid07 from "../meshes/kid07.off";
import kid08 from "../meshes/kid08.off";
import kid09 from "../meshes/kid09.off";
import kid10 from "../meshes/kid10.off";
import kid11 from "../meshes/kid11.off";
import kid12 from "../meshes/kid12.off";
import kid13 from "../meshes/kid13.off";
import kid14 from "../meshes/kid14.off";
import kid15 from "../meshes/kid15.off";
import kid16 from "../meshes/kid16.off";
import kid17 from "../meshes/kid17.off";
import kid18 from "../meshes/kid18.off";
import kid19 from "../meshes/kid19.off";
import kid20 from "../meshes/kid20.off";
import kid21 from "../meshes/kid21.off";
import kid22 from "../meshes/kid22.off";
import kid23 from "../meshes/kid23.off";
import kid24 from "../meshes/kid24.off";
import kid25 from "../meshes/kid25.off";

export const ASSIGNMENTS = Object.freeze({
    Geodesic: "Geodesic Distance",
    Bilateral: "Bilateral Descriptor",
    MultiSeedBilateral: "Multi-Seed Bilateral Descriptor",
    TriangularBilateral: "Triangular Bilateral Descriptor",
    IsoCurve: "Iso-Curve Descriptor",
    FarthestPoint: "Farthest Point Sampling",
    MeshParameterization: "Mesh Parameterization",
});

export const NULL_SHAPE = "meshes/kid00.off";

const SHREC_2016 = {
    kid00,
    kid01,
    kid02,
    kid03,
    kid04,
    kid05,
    kid06,
    kid07,
    kid08,
    kid09,
    kid10,
    kid11,
    kid12,
    kid13,
    kid14,
    kid15,
    kid16,
    kid17,
    kid18,
    kid19,
    kid20,
    kid21,
    kid22,
    kid23,
    kid24,
    kid25,
};

export function getModelRef(model) {
    return import(/* webpackChunkName: "[request]" */
    `ref-loader!../${model.slice(0, -4)}_ref.txt`);
}

export const MODELS = Object.freeze({
    Geodesic: SHREC_2016,
    IsoCurve: SHREC_2016,
    Bilateral: SHREC_2016,
    MultiSeedBilateral: SHREC_2016,
    TriangularBilateral: SHREC_2016,
    FarthestPoint: SHREC_2016,
    MeshParameterization: {
        facemLow,
        facem,
        faceLow,
        face,
    },
});

export const Q_TYPES = Object.freeze({
    Set: "Set",
    MinHeap: "Min Heap",
    FibonacciHeap: "Fibonacci Heap",
});

export const VERTEX_SELECTIONS = Object.freeze({
    Random: "Random",
    FirstAndLast: "First and Last",
    FarthestPoint: "Farthest Points",
});

export const WEIGHT_APPROACHES = Object.freeze({
    Uniform: "Uniform",
    Harmonic: "Harmonic",
    MeanValue: "Mean-Value",
});

export const BOUNDARY_SHAPES = Object.freeze({
    Free: "Free",
    Circle: "Circle",
});

export const MOUTH_FIXATIONS = Object.freeze({
    True: "True",
    False: "False",
});
