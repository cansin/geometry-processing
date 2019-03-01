import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import dragon from "./models/dragon.obj";

const scene = new Scene();
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// instantiate a loader
const loader = new OBJLoader();

// load a resource
loader.load(
    // resource URL
    dragon,
    // called when resource is loaded
    function(object) {
        scene.add(object);
    },
    // called when loading is in progresses
    function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function() {
        console.log("An error happened");
    },
);

camera.position.z = 5;

const animate = function() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();
