import face from "../meshes/mesh parameterization/face.off";
import faceLow from "../meshes/mesh parameterization/face-low.off";
import facem from "../meshes/mesh parameterization/facem.off";
import facemLow from "../meshes/mesh parameterization/facem-low.off";
import firstIsometry1 from "../meshes/0001.isometry.1.off";
import firstIsometry2 from "../meshes/0001.isometry.2.off";
import firstIsometry3 from "../meshes/0001.isometry.3.off";
import firstIsometry4 from "../meshes/0001.isometry.4.off";
import firstIsometry5 from "../meshes/0001.isometry.5.off";
import firstIsometry6 from "../meshes/0001.isometry.6.off";
import firstIsometry7 from "../meshes/0001.isometry.7.off";
import firstIsometry8 from "../meshes/0001.isometry.8.off";
import firstIsometry9 from "../meshes/0001.isometry.9.off";
import firstIsometry10 from "../meshes/0001.isometry.10.off";
import firstIsometry11 from "../meshes/0001.isometry.11.off";
import firstIsometry12 from "../meshes/0001.isometry.12.off";
import firstIsometry13 from "../meshes/0001.isometry.13.off";
import firstIsometry14 from "../meshes/0001.isometry.14.off";
import firstIsometry15 from "../meshes/0001.isometry.15.off";
import firstNull0 from "../meshes/0001.null.0.off";
import secondIsometry1 from "../meshes/0002.isometry.1.off";
import secondIsometry2 from "../meshes/0002.isometry.2.off";
import secondIsometry3 from "../meshes/0002.isometry.3.off";
import secondIsometry4 from "../meshes/0002.isometry.4.off";
import secondIsometry5 from "../meshes/0002.isometry.5.off";
import secondIsometry6 from "../meshes/0002.isometry.6.off";
import secondIsometry7 from "../meshes/0002.isometry.7.off";
import secondIsometry8 from "../meshes/0002.isometry.8.off";
import secondIsometry9 from "../meshes/0002.isometry.9.off";
import secondIsometry10 from "../meshes/0002.isometry.10.off";
import secondIsometry11 from "../meshes/0002.isometry.11.off";
import secondIsometry12 from "../meshes/0002.isometry.12.off";
import secondIsometry13 from "../meshes/0002.isometry.13.off";
import secondIsometry14 from "../meshes/0002.isometry.14.off";
import secondIsometry15 from "../meshes/0002.isometry.15.off";
import secondNull15 from "../meshes/0002.null.0.off";

export const ASSIGNMENTS = Object.freeze({
    Geodesic: "Geodesic Distance",
    Bilateral: "Bilateral Descriptor",
    MultiSeedBilateral: "Multi-Seed Bilateral Descriptor",
    TriangularBilateral: "Triangular Bilateral Descriptor",
    IsoCurve: "Iso-Curve Descriptor",
    FarthestPoint: "Farthest Point Sampling",
    MeshParameterization: "Mesh Parameterization",
});

const KIDS = {
    firstNull0,
    firstIsometry1,
    firstIsometry2,
    firstIsometry3,
    firstIsometry4,
    firstIsometry5,
    firstIsometry6,
    firstIsometry7,
    firstIsometry8,
    firstIsometry9,
    firstIsometry10,
    firstIsometry11,
    firstIsometry12,
    firstIsometry13,
    firstIsometry14,
    firstIsometry15,
    secondNull15,
    secondIsometry1,
    secondIsometry2,
    secondIsometry3,
    secondIsometry4,
    secondIsometry5,
    secondIsometry6,
    secondIsometry7,
    secondIsometry8,
    secondIsometry9,
    secondIsometry10,
    secondIsometry11,
    secondIsometry12,
    secondIsometry13,
    secondIsometry14,
    secondIsometry15,
};

export const MODELS = Object.freeze({
    Geodesic: KIDS,
    IsoCurve: KIDS,
    Bilateral: KIDS,
    MultiSeedBilateral: KIDS,
    TriangularBilateral: KIDS,
    FarthestPoint: KIDS,
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
