import horse0 from "../meshes1/1) use for geodesic/fprint matrix/horse0.off";
import man0 from "../meshes1/1) use for geodesic/fprint matrix/man0.off";
import centaur from "../meshes1/1) use for geodesic/timing/centaur.off";
import dragon from "../meshes1/1) use for geodesic/timing/dragon.obj";
import man from "../meshes1/1) use for geodesic/timing/man.off";
import weirdSphere from "../meshes1/1) use for geodesic/timing/weirdSphere.off";
import man4 from "../meshes1/2) use for iso-curve descriptor/man4.off";
import man3 from "../meshes1/2) use for iso-curve descriptor/man3.off";
import gorilla from "../meshes1/2) use for iso-curve descriptor/gorilla.off";
import woman from "../meshes1/2) use for iso-curve descriptor/woman.off";
import man2 from "../meshes1/2) use for iso-curve descriptor/man2.off";
import princetonHuman32Incomplete from "../meshes1/3) use for bilateral descriptor/princeton-Human-32-incomplete.off";
import princetonHuman30 from "../meshes1/3) use for bilateral descriptor/princeton-Human-30.off";
import neptune from "../meshes1/3) use for bilateral descriptor/neptune.off";
import human from "../meshes1/3) use for bilateral descriptor/human.off";
import humanWithShortcut from "../meshes1/3) use for bilateral descriptor/human_with_shortcut.off";
import horse2 from "../meshes1/3) use for bilateral descriptor/horse2.off";
import horse1 from "../meshes1/3) use for bilateral descriptor/horse1.off";
import horsePartialHole2 from "../meshes1/3) use for bilateral descriptor/horse_partial_hole2.off";
import horsePartialHole from "../meshes1/3) use for bilateral descriptor/horse_partial_hole.off";
import centaur2 from "../meshes1/3) use for bilateral descriptor/centaur2.off";
import cat1 from "../meshes1/3) use for bilateral descriptor/cat1.off";
import cat from "../meshes1/3) use for bilateral descriptor/cat.off";

export const ASSIGNMENTS = Object.freeze({
    Geodesic: "Geodesic Distance",
    Bilateral: "Bilateral Descriptor",
    MultiSeedBilateral: "Multi-Seed Bilateral Descriptor",
    TriangularBilateral: "Triangular Bilateral Descriptor",
    IsoCurve: "Iso-Curve Descriptor",
    FarthestPoint: "Farthest Point Sampling",
});

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
