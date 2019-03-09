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
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { prepareDataStructures } from "../algorithms/helpers";
import { findGeodesicDistance } from "../algorithms/geodesic";
import { findBilateralMap } from "../algorithms/bilateral_map";
import { ASSIGNMENTS } from "./Store";

@observer
class ThreeScene extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    componentDidMount() {
        // ADD SCENE
        this.scene = new Scene();

        // ADD CAMERA
        this.camera = new PerspectiveCamera(
            45,
            this.mount.clientWidth / this.mount.clientHeight,
            1,
            2000,
        );
        this.camera.position.z = 250;
        this.camera.add(new PointLight(0xffffff, 0.8));

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

        // ADD MATERIALS
        this.meshLineMaterial = new MeshLineMaterial({
            color: 0xff0000,
            lineWidth: 0.75,
            resolution: new Vector2(window.innerWidth, window.innerHeight),
        });

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

        this.offLoader = new OFFLoader(this.loadingManager);
        this.objLoader = new OBJLoader(this.loadingManager);

        window.addEventListener("resize", this.handleResize.bind(this));

        // START RENDERING
        this.loadObject();

        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate.bind(this));
        }
    }

    componentDidUpdate() {
        this.loadObject();
    }

    loadObject() {
        const { assignment, model, setTiming } = this.props.store;
        const loader = model.endsWith(".off") ? this.offLoader : this.objLoader;
        let startTime;

        startTime = new Date();
        console.log(`Loading Object...`);
        loader.load(model, object => {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            this.scene.add(new AmbientLight(0xcccccc, 0.4));
            this.scene.add(this.camera);

            this.scene.add(object);
            console.log(`\tdone in ${new Date() - startTime}ms.`);

            object.traverse(child => {
                if (child instanceof Mesh) {
                    if (child.geometry && !child.geometry.isGeometry) {
                        child.geometry = new Geometry().fromBufferGeometry(
                            child.geometry,
                        );
                        child.geometry.mergeVertices();
                    }

                    child.geometry.normalize();
                    child.geometry.scale(75, 75, 75);

                    child.material.opacity = 0.95;
                    child.material.transparent = true;
                    child.material.color.setHex(0xcccccc);

                    this.renderWireframe(child);
                    let startTime,
                        elapsedTime,
                        totalTime = 0;
                    startTime = new Date();
                    console.log(`🌟 Calculating ${ASSIGNMENTS[assignment]}...`);

                    if (ASSIGNMENTS[assignment] === ASSIGNMENTS.Geodesic) {
                        const { graph, source, target } = prepareDataStructures(
                            child,
                        );

                        const { path } = findGeodesicDistance(
                            graph,
                            source,
                            target,
                        );

                        this.renderShortestPath(path);
                        this.renderVertex(path[0]);
                        this.renderVertex(path[path.length - 1]);
                    } else if (
                        ASSIGNMENTS[assignment] === ASSIGNMENTS.Bilateral
                    ) {
                        const { graph, source, target } = prepareDataStructures(
                            child,
                        );

                        const { path } = findGeodesicDistance(
                            graph,
                            source,
                            target,
                        );

                        this.renderShortestPath(path);
                        this.renderVertex(path[0]);
                        this.renderVertex(path[path.length - 1]);
                    } else if (
                        ASSIGNMENTS[assignment] === ASSIGNMENTS.IsoCurve
                    ) {
                        // do nothing
                    }

                    elapsedTime = new Date() - startTime;
                    totalTime += elapsedTime;
                    console.log(`✅ Total time ${elapsedTime}ms.`);

                    setTiming(totalTime);
                }
            });
        });
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild(this.renderer.domElement);
    }

    handleResize() {
        this.meshLineMaterial.resolution = new Vector2(
            this.mount.clientWidth,
            this.mount.clientHeight,
        );
        this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
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
        const geometry = new Geometry();
        path.forEach(vertexString => {
            geometry.vertices.push(
                new Vector3(...vertexString.split(",").map(Number)),
            );
        });

        const line = new MeshLine();
        line.setGeometry(geometry);

        this.scene.add(new Mesh(line.geometry, this.meshLineMaterial));
    }

    renderVertex(vertexString) {
        const material = new MeshPhongMaterial({ color: 0x00ff00 });

        const geometry = new SphereBufferGeometry(0.75);
        geometry.translate(...vertexString.split(",").map(Number));

        const sphere = new Mesh(geometry, material);

        this.scene.add(sphere);
    }

    render() {
        const { assignment, model } = this.props.store;
        return (
            <Paper style={{ height: "100%" }}>
                <Grid container style={{ height: "100%" }}>
                    <div
                        aria-label={`${assignment} ${model}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: 600,
                        }}
                        ref={mount => {
                            this.mount = mount;
                        }}
                    />
                </Grid>
            </Paper>
        );
    }
}

export default ThreeScene;
