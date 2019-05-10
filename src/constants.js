import horse0 from "../meshes/geodesic distance/fprint matrix/horse0.off";
import man0 from "../meshes/geodesic distance/fprint matrix/man0.off";
import centaur from "../meshes/geodesic distance/timing/centaur.off";
import dragon from "../meshes/geodesic distance/timing/dragon.obj";
import man from "../meshes/geodesic distance/timing/man.off";
import weirdSphere from "../meshes/geodesic distance/timing/weirdSphere.off";
import man4 from "../meshes/iso-curve descriptor/man4.off";
import man3 from "../meshes/iso-curve descriptor/man3.off";
import gorilla from "../meshes/iso-curve descriptor/gorilla.off";
import woman from "../meshes/iso-curve descriptor/woman.off";
import man2 from "../meshes/iso-curve descriptor/man2.off";
import princetonHuman32Incomplete from "../meshes/bilateral descriptor/princeton-Human-32-incomplete.off";
import princetonHuman30 from "../meshes/bilateral descriptor/princeton-Human-30.off";
import neptune from "../meshes/bilateral descriptor/neptune.off";
import human from "../meshes/bilateral descriptor/human.off";
import humanWithShortcut from "../meshes/bilateral descriptor/human_with_shortcut.off";
import horse2 from "../meshes/bilateral descriptor/horse2.off";
import horse1 from "../meshes/bilateral descriptor/horse1.off";
import horsePartialHole2 from "../meshes/bilateral descriptor/horse_partial_hole2.off";
import horsePartialHole from "../meshes/bilateral descriptor/horse_partial_hole.off";
import centaur2 from "../meshes/bilateral descriptor/centaur2.off";
import cat1 from "../meshes/bilateral descriptor/cat1.off";
import cat from "../meshes/bilateral descriptor/cat.off";
import face from "../meshes/mesh parameterization/face.off";
import faceLow from "../meshes/mesh parameterization/face-low.off";
import facem from "../meshes/mesh parameterization/facem.off";
import facemLow from "../meshes/mesh parameterization/facem-low.off";
import kid00 from "../meshes/triangular bilateral descriptor/low resolution/kid00.off";
import kid01 from "../meshes/triangular bilateral descriptor/low resolution/kid01.off";
import kid02 from "../meshes/triangular bilateral descriptor/low resolution/kid02.off";
import kid03 from "../meshes/triangular bilateral descriptor/low resolution/kid03.off";
import kid04 from "../meshes/triangular bilateral descriptor/low resolution/kid04.off";
import kid05 from "../meshes/triangular bilateral descriptor/low resolution/kid05.off";
import kid06 from "../meshes/triangular bilateral descriptor/low resolution/kid06.off";
import kid07 from "../meshes/triangular bilateral descriptor/low resolution/kid07.off";
import kid08 from "../meshes/triangular bilateral descriptor/low resolution/kid08.off";
import kid09 from "../meshes/triangular bilateral descriptor/low resolution/kid09.off";
import kid10 from "../meshes/triangular bilateral descriptor/low resolution/kid10.off";
import kid11 from "../meshes/triangular bilateral descriptor/low resolution/kid11.off";
import kid12 from "../meshes/triangular bilateral descriptor/low resolution/kid12.off";
import kid13 from "../meshes/triangular bilateral descriptor/low resolution/kid13.off";
import kid14 from "../meshes/triangular bilateral descriptor/low resolution/kid14.off";
import kid15 from "../meshes/triangular bilateral descriptor/low resolution/kid15.off";
import kid16 from "../meshes/triangular bilateral descriptor/low resolution/kid16.off";
import kid17 from "../meshes/triangular bilateral descriptor/low resolution/kid17.off";
import kid18 from "../meshes/triangular bilateral descriptor/low resolution/kid18.off";
import kid19 from "../meshes/triangular bilateral descriptor/low resolution/kid19.off";
import kid20 from "../meshes/triangular bilateral descriptor/low resolution/kid20.off";
import kid21 from "../meshes/triangular bilateral descriptor/low resolution/kid21.off";
import kid22 from "../meshes/triangular bilateral descriptor/low resolution/kid22.off";
import kid23 from "../meshes/triangular bilateral descriptor/low resolution/kid23.off";
import kid24 from "../meshes/triangular bilateral descriptor/low resolution/kid24.off";
import kid25 from "../meshes/triangular bilateral descriptor/low resolution/kid25.off";
import kid01Ref from "../meshes/triangular bilateral descriptor/low resolution/kid01_ref.txt";
import kid02Ref from "../meshes/triangular bilateral descriptor/low resolution/kid02_ref.txt";
import kid03Ref from "../meshes/triangular bilateral descriptor/low resolution/kid03_ref.txt";
import kid04Ref from "../meshes/triangular bilateral descriptor/low resolution/kid04_ref.txt";
import kid05Ref from "../meshes/triangular bilateral descriptor/low resolution/kid05_ref.txt";
import kid06Ref from "../meshes/triangular bilateral descriptor/low resolution/kid06_ref.txt";
import kid07Ref from "../meshes/triangular bilateral descriptor/low resolution/kid07_ref.txt";
import kid08Ref from "../meshes/triangular bilateral descriptor/low resolution/kid08_ref.txt";
import kid09Ref from "../meshes/triangular bilateral descriptor/low resolution/kid09_ref.txt";
import kid10Ref from "../meshes/triangular bilateral descriptor/low resolution/kid10_ref.txt";
import kid11Ref from "../meshes/triangular bilateral descriptor/low resolution/kid11_ref.txt";
import kid12Ref from "../meshes/triangular bilateral descriptor/low resolution/kid12_ref.txt";
import kid13Ref from "../meshes/triangular bilateral descriptor/low resolution/kid13_ref.txt";
import kid14Ref from "../meshes/triangular bilateral descriptor/low resolution/kid14_ref.txt";
import kid15Ref from "../meshes/triangular bilateral descriptor/low resolution/kid15_ref.txt";
import kid16Ref from "../meshes/triangular bilateral descriptor/low resolution/kid16_ref.txt";
import kid17Ref from "../meshes/triangular bilateral descriptor/low resolution/kid17_ref.txt";
import kid18Ref from "../meshes/triangular bilateral descriptor/low resolution/kid18_ref.txt";
import kid19Ref from "../meshes/triangular bilateral descriptor/low resolution/kid19_ref.txt";
import kid20Ref from "../meshes/triangular bilateral descriptor/low resolution/kid20_ref.txt";
import kid21Ref from "../meshes/triangular bilateral descriptor/low resolution/kid21_ref.txt";
import kid22Ref from "../meshes/triangular bilateral descriptor/low resolution/kid22_ref.txt";
import kid23Ref from "../meshes/triangular bilateral descriptor/low resolution/kid23_ref.txt";
import kid24Ref from "../meshes/triangular bilateral descriptor/low resolution/kid24_ref.txt";
import kid25Ref from "../meshes/triangular bilateral descriptor/low resolution/kid25_ref.txt";

export const ASSIGNMENTS = Object.freeze({
    Geodesic: "Geodesic Distance",
    Bilateral: "Bilateral Descriptor",
    MultiSeedBilateral: "Multi-Seed Bilateral Descriptor",
    TriangularBilateral: "Triangular Bilateral Descriptor",
    IsoCurve: "Iso-Curve Descriptor",
    FarthestPoint: "Farthest Point Sampling",
    MeshParameterization: "Mesh Parameterization",
});

export const MODEL_REFS = Object.freeze(
    new Map([
        [kid00, undefined],
        [kid01, kid01Ref],
        [kid02, kid02Ref],
        [kid03, kid03Ref],
        [kid04, kid04Ref],
        [kid05, kid05Ref],
        [kid06, kid06Ref],
        [kid07, kid07Ref],
        [kid08, kid08Ref],
        [kid09, kid09Ref],
        [kid10, kid10Ref],
        [kid11, kid11Ref],
        [kid12, kid12Ref],
        [kid13, kid13Ref],
        [kid14, kid14Ref],
        [kid15, kid15Ref],
        [kid16, kid16Ref],
        [kid17, kid17Ref],
        [kid18, kid18Ref],
        [kid19, kid19Ref],
        [kid20, kid20Ref],
        [kid21, kid21Ref],
        [kid22, kid22Ref],
        [kid23, kid23Ref],
        [kid24, kid24Ref],
        [kid25, kid25Ref],
    ]),
);

export const MODELS = Object.freeze({
    Geodesic: { horse0, man0, centaur, dragon, man, weirdSphere },
    IsoCurve: { man0, dragon, man4, man3, gorilla, woman, man2 },
    Bilateral: {
        princetonHuman32Incomplete,
        princetonHuman30,
        neptune,
        human,
        humanWithShortcut,
        horse2,
        horse1,
        horsePartialHole2,
        horsePartialHole,
        centaur2,
        centaur,
        cat1,
        cat,
    },
    MultiSeedBilateral: {
        princetonHuman32Incomplete,
        princetonHuman30,
        neptune,
        human,
        humanWithShortcut,
        horse2,
        horse1,
        horsePartialHole2,
        horsePartialHole,
        centaur2,
        centaur,
        cat1,
        cat,
    },
    TriangularBilateral: {
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
    },
    FarthestPoint: {
        princetonHuman32Incomplete,
        princetonHuman30,
        neptune,
        human,
        humanWithShortcut,
        horse2,
        horse1,
        horsePartialHole2,
        horsePartialHole,
        centaur2,
        centaur,
        cat1,
        cat,
    },
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
