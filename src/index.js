import {
    AmbientLight,
    LoadingManager,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import dragon from "./models/dragon.obj";
import "./index.less";

let object;

// camera
const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000,
);
camera.position.z = 250;
camera.add(new PointLight(0xffffff, 0.8));

// scene
const scene = new Scene();
scene.add(new AmbientLight(0xcccccc, 0.4));
scene.add(camera);

// manager
const manager = new LoadingManager(
    () => {
        scene.add(object);
    },
    (item, loaded, total) => {
        console.log(item, loaded, total);
    },
);

// model
const loader = new OBJLoader(manager);
loader.load(dragon, obj => {
    object = obj;
});

//
const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// controls
const controls = new TrackballControls(camera, renderer.domElement);

//
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
    window.requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

window.requestAnimationFrame(animate);
