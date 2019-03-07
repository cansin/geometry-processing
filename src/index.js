import {
    AmbientLight,
    LoadingManager,
    PerspectiveCamera,
    PointLight,
    Scene,
    TextureLoader,
    WebGLRenderer,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import dragon from "./models/dragon.obj";
import uvGridSm from "./textures/UV_Grid_Sm.jpg";
import "./index.less";

let object;

const container = document.createElement("div");
document.body.appendChild(container);
const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000,
);
camera.position.z = 250;

// scene
const scene = new Scene();
const ambientLight = new AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);
const pointLight = new PointLight(0xffffff, 0.8);
camera.add(pointLight);
scene.add(camera);

// manager
const manager = new LoadingManager(() => {
    object.traverse(child => {
        if (child.isMesh) child.material.map = texture;
    });
    scene.add(object);
});
manager.onProgress = (item, loaded, total) => {
    console.log(item, loaded, total);
};

// texture
const textureLoader = new TextureLoader(manager);
const texture = textureLoader.load(uvGridSm);

// model
const loader = new OBJLoader(manager);
loader.load(
    dragon,
    obj => {
        object = obj;
    },
    xhr => {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(
                "model " + Math.round(percentComplete, 2) + "% downloaded",
            );
        }
    },
    () => {},
);

//
const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

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
