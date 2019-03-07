import {
    AmbientLight,
    FaceNormalsHelper,
    LineSegments,
    LoadingManager,
    Mesh,
    PerspectiveCamera,
    PointLight,
    Scene,
    WebGLRenderer,
    WireframeGeometry,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import dijkstra from "./dijkstra";
import { OFFLoader } from "./off_loader";
import horse0 from "./meshes1/1) use for geodesic/fprint matrix/horse0.off";
import dragon from "./meshes1/1) use for geodesic/timing/dragon.obj";
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
        object.traverse(child => {
            if (child instanceof Mesh) {
                const wireframe = new WireframeGeometry(child.geometry);
                const line = new LineSegments(wireframe);
                line.material.color.setHex(0xcc0000);
                scene.add(line);

                const normals = new FaceNormalsHelper(child, 2, 0x00ff00, 1);
                scene.add(normals);
            }
        });
    },
    (item, loaded, total) => {
        console.log(item, loaded, total);
    },
);

// model
const loader = new OFFLoader(manager);
const url = horse0;

// const loader = new OBJLoader(manager);
// const url = dragon;

loader.load(url, obj => {
    object = obj;

    object.traverse(child => {
        if (child instanceof Mesh) {
            child.material.color.setHex(0xcccccc);

            dijkstra(child);
        }
    });
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
