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
import scan000 from "../meshes/scan_000.obj";
import scan001 from "../meshes/scan_001.obj";
import scan002 from "../meshes/scan_002.obj";
import scan003 from "../meshes/scan_003.obj";
import scan004 from "../meshes/scan_004.obj";
import scan005 from "../meshes/scan_005.obj";
import scan006 from "../meshes/scan_006.obj";
import scan007 from "../meshes/scan_007.obj";
import scan008 from "../meshes/scan_008.obj";
import scan009 from "../meshes/scan_009.obj";
import scan010 from "../meshes/scan_010.obj";
import scan011 from "../meshes/scan_011.obj";
import scan012 from "../meshes/scan_012.obj";
import scan013 from "../meshes/scan_013.obj";
import scan014 from "../meshes/scan_014.obj";
import scan015 from "../meshes/scan_015.obj";
import scan016 from "../meshes/scan_016.obj";
import scan017 from "../meshes/scan_017.obj";
import scan018 from "../meshes/scan_018.obj";
import scan019 from "../meshes/scan_019.obj";
import scan020 from "../meshes/scan_020.obj";
import scan021 from "../meshes/scan_021.obj";
import scan022 from "../meshes/scan_022.obj";
import scan023 from "../meshes/scan_023.obj";
import scan024 from "../meshes/scan_024.obj";
import scan025 from "../meshes/scan_025.obj";
import scan026 from "../meshes/scan_026.obj";
import scan027 from "../meshes/scan_027.obj";
import scan028 from "../meshes/scan_028.obj";
import scan029 from "../meshes/scan_029.obj";
import scan030 from "../meshes/scan_030.obj";
import scan031 from "../meshes/scan_031.obj";
import scan032 from "../meshes/scan_032.obj";
import scan033 from "../meshes/scan_033.obj";
import scan034 from "../meshes/scan_034.obj";
import scan035 from "../meshes/scan_035.obj";
import scan036 from "../meshes/scan_036.obj";
import scan037 from "../meshes/scan_037.obj";
import scan038 from "../meshes/scan_038.obj";
import scan039 from "../meshes/scan_039.obj";
import scan040 from "../meshes/scan_040.obj";
import scan041 from "../meshes/scan_041.obj";
import scan042 from "../meshes/scan_042.obj";
import scan043 from "../meshes/scan_043.obj";
import scan044 from "../meshes/scan_044.obj";
import scan045 from "../meshes/scan_045.obj";
import scan046 from "../meshes/scan_046.obj";
import scan047 from "../meshes/scan_047.obj";
import scan048 from "../meshes/scan_048.obj";
import scan049 from "../meshes/scan_049.obj";

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

const SHREC_2019 = {
    scan000,
    scan001,
    scan002,
    scan003,
    scan004,
    scan005,
    scan006,
    scan007,
    scan008,
    scan009,
    scan010,
    scan011,
    scan012,
    scan013,
    scan014,
    scan015,
    scan016,
    scan017,
    scan018,
    scan019,
    scan020,
    scan021,
    scan022,
    scan023,
    scan024,
    scan025,
    scan026,
    scan027,
    scan028,
    scan029,
    scan030,
    scan031,
    scan032,
    scan033,
    scan034,
    scan035,
    scan036,
    scan037,
    scan038,
    scan039,
    scan040,
    scan041,
    scan042,
    scan043,
    scan044,
    scan045,
    scan046,
    scan047,
    scan048,
    scan049,
};

export function getModelRef(model) {
    return import(/* webpackChunkName: "[request]" */
    `ref-loader!../${model.slice(0, -4)}_ref.txt`).catch(() =>
        Promise.resolve({ default: { get: () => {} } }),
    );
}

export const MODELS = Object.freeze({
    Geodesic: SHREC_2019,
    IsoCurve: SHREC_2019,
    Bilateral: SHREC_2019,
    MultiSeedBilateral: SHREC_2019,
    TriangularBilateral: SHREC_2019,
    FarthestPoint: SHREC_2019,
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
