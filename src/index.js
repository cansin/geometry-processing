import {
    AmbientLight,
    Geometry,
    LineBasicMaterial,
    LineSegments,
    LoadingManager,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    SphereBufferGeometry,
    Vector2,
    Vector3,
    WebGLRenderer,
    WireframeGeometry,
} from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import findShortestPath from "./shortest_path";
import { OFFLoader } from "./off_loader";
import horse0 from "./meshes1/1) use for geodesic/fprint matrix/horse0.off";
import man0 from "./meshes1/1) use for geodesic/fprint matrix/man0.off";
import dragon from "./meshes1/1) use for geodesic/timing/dragon.obj";
import centaur from "./meshes1/1) use for geodesic/timing/centaur.off";
import "./index.less";

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

const meshLineMaterial = new MeshLineMaterial({
    color: 0xff0000,
    lineWidth: 2,
    resolution: new Vector2(window.innerWidth, window.innerHeight),
});

// manager
const manager = new LoadingManager(
    () => {},
    (item, loaded, total) => {
        console.log(item, loaded, total);
    },
    item => {
        console.error(item);
    },
);

// model
const loader = new OFFLoader(manager);
const url = horse0;

// const loader = new OBJLoader(manager);
// const url = dragon;

function renderWireframe(mesh) {
    const material = new LineBasicMaterial({
        color: 0xffffff,
    });

    const geometry = new WireframeGeometry(mesh.geometry);

    const line = new LineSegments(geometry, material);

    scene.add(line);
}

function renderShortestPath(path) {
    const geometry = new Geometry();
    path.forEach(vertexString => {
        geometry.vertices.push(
            new Vector3(...vertexString.split(",").map(Number)),
        );
    });

    const line = new MeshLine();
    line.setGeometry(geometry);

    scene.add(new Mesh(line.geometry, meshLineMaterial));
}

function renderVertex(vertexString) {
    var geometry = new SphereBufferGeometry(2);
    geometry.translate(...vertexString.split(",").map(Number));
    var material = new MeshPhongMaterial({ color: 0x00ff00 });
    var sphere = new Mesh(geometry, material);
    scene.add(sphere);
}

loader.load(url, object => {
    scene.add(object);

    object.traverse(child => {
        if (child instanceof Mesh) {
            child.material.opacity = 0.75;
            child.material.transparent = true;
            child.material.color.setHex(0xcccccc);

            renderWireframe(child);

            const path = findShortestPath(child);
            renderShortestPath(path);
            renderVertex(path[0]);
            renderVertex(path[path.length - 1]);
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
    meshLineMaterial.resolution = new Vector2(
        window.innerWidth,
        window.innerHeight,
    );
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
