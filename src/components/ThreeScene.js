import React, { Component } from "react";
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
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import { OFFLoader } from "../loaders/OFFLoader";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { findShortestPath } from "../algorithms/shortest_path";
import horse0 from "../meshes1/1) use for geodesic/fprint matrix/horse0.off";
import dragon from "../meshes1/1) use for geodesic/timing/dragon.obj";

export default class ThreeScene extends Component {
    componentDidMount() {
        // ADD SCENE
        this.scene = new Scene();
        this.scene.add(new AmbientLight(0xcccccc, 0.4));

        // ADD CAMERA
        this.camera = new PerspectiveCamera(
            45,
            this.mount.clientWidth / this.mount.clientHeight,
            1,
            2000,
        );
        this.camera.position.z = 250;
        this.camera.add(new PointLight(0xffffff, 0.8));
        this.scene.add(this.camera);

        // ADD RENDERER
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
        this.mount.appendChild(this.renderer.domElement);

        // ADD CONTROLS
        this.controls = new TrackballControls(
            this.camera,
            this.renderer.domElement,
        );

        // ADD LOADERS
        this.loadingManager = new LoadingManager(
            () => {},
            (item, loaded, total) => {
                console.log(item, loaded, total);
            },
            item => {
                console.error(item);
            },
        );

        // this.loader = new OFFLoader(this.loadingManager);
        // this.url = horse0;

        this.loader = new OBJLoader(this.loadingManager);
        this.url = dragon;

        // START RENDERING
        this.loadObject();

        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate.bind(this));
        }
    }

    loadObject() {
        this.loader.load(this.url, object => {
            this.scene.add(object);

            object.traverse(child => {
                if (child instanceof Mesh) {
                    child.material.opacity = 0.75;
                    child.material.transparent = true;
                    child.material.color.setHex(0xcccccc);

                    this.renderWireframe(child);

                    const path = findShortestPath(child);
                    this.renderShortestPath(path);
                    this.renderVertex(path[0]);
                    this.renderVertex(path[path.length - 1]);
                }
            });
        });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild(this.renderer.domElement);
    }

    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.frameId = window.requestAnimationFrame(this.animate.bind(this));
    }

    renderWireframe(mesh) {
        const material = new LineBasicMaterial({
            color: 0xffffff,
        });

        const geometry = new WireframeGeometry(mesh.geometry);

        const line = new LineSegments(geometry, material);

        this.scene.add(line);
    }

    renderShortestPath(path) {
        const material = new MeshLineMaterial({
            color: 0xff0000,
            lineWidth: 1,
            resolution: new Vector2(window.innerWidth, window.innerHeight),
        });

        const geometry = new Geometry();
        path.forEach(vertexString => {
            geometry.vertices.push(
                new Vector3(...vertexString.split(",").map(Number)),
            );
        });

        const line = new MeshLine();
        line.setGeometry(geometry);

        this.scene.add(new Mesh(line.geometry, material));
    }

    renderVertex(vertexString) {
        var geometry = new SphereBufferGeometry(1);
        geometry.translate(...vertexString.split(",").map(Number));
        var material = new MeshPhongMaterial({ color: 0x00ff00 });
        var sphere = new Mesh(geometry, material);
        this.scene.add(sphere);
    }

    render() {
        return (
            <div
                style={{ width: "100%", height: "100%" }}
                ref={mount => {
                    this.mount = mount;
                }}
            />
        );
    }
}

// window.addEventListener("resize", () => {
//     meshLineMaterial.resolution = new Vector2(
//         window.innerWidth,
//         window.innerHeight,
//     );
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// });
