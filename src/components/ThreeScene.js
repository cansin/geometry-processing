import React, { Component } from "react";
import {
    AmbientLight,
    FaceColors,
    Geometry,
    Line,
    LineBasicMaterial,
    LoadingManager,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    SphereBufferGeometry,
    Vector2,
    WebGLRenderer,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import { OFFLoader } from "../loaders/OFFLoader";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { createNormalizedNaiveGeometry, prepareDataStructures } from "../algorithms/helpers";
import { findGeodesicDistance } from "../algorithms/geodesic_distance";
import { findBilateralMap } from "../algorithms/bilateral_map";
import { ASSIGNMENTS } from "./constants";
import { farthestPointSampling } from "../algorithms/farthest_point_sampling";
import { findIsoCurveSignature } from "../algorithms/iso_curve_signature";

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
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);

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
        const {
            assignment,
            model,
            qType,
            vertexSelection,
            vertexCount,
            setTiming,
        } = this.props.store;
        const loader = model.endsWith(".off") ? this.offLoader : this.objLoader;
        let startTime,
            elapsedTime,
            totalTime = 0;

        startTime = new Date();
        console.clear();
        console.log(`Loading Object...`);
        loader.load(model, object => {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            this.scene.add(new AmbientLight(0xcccccc, 0.4));
            this.scene.add(this.camera);

            elapsedTime = new Date() - startTime;
            totalTime += elapsedTime;
            console.log(`\tdone in ${elapsedTime}ms.`);

            object.traverse(child => {
                if (child instanceof Mesh) {
                    child.geometry = createNormalizedNaiveGeometry(child);

                    child.material.color.setHex(0xcccccc);

                    startTime = new Date();
                    console.log(`🌟 Calculating ${ASSIGNMENTS[assignment]}...`);

                    const { graph, source, target } = prepareDataStructures(
                        child,
                        qType,
                        vertexSelection,
                        vertexCount,
                    );

                    if (ASSIGNMENTS[assignment] === ASSIGNMENTS.Geodesic) {
                        const { path } = findGeodesicDistance(graph, qType, source, target);

                        this.renderPathAsMeshLine(path);
                        this.renderVertex(source);
                        this.renderVertex(target);
                    } else if (ASSIGNMENTS[assignment] === ASSIGNMENTS.Bilateral) {
                        child.material.vertexColors = FaceColors;

                        const { path } = findBilateralMap(
                            child.geometry,
                            graph,
                            qType,
                            source,
                            target,
                        );

                        this.renderPathAsMeshLine(path);
                        this.renderVertex(path[0]);
                        this.renderVertex(path[path.length - 1]);
                    } else if (ASSIGNMENTS[assignment] === ASSIGNMENTS.FarthestPoint) {
                        const { farthestPoints } = farthestPointSampling(graph, qType, source, 100);

                        farthestPoints.forEach(vertex => {
                            this.renderVertex(vertex);
                        });
                    } else if (ASSIGNMENTS[assignment] === ASSIGNMENTS.IsoCurve) {
                        const { isoCurves } = findIsoCurveSignature(
                            child.geometry,
                            graph,
                            qType,
                            source,
                        );

                        this.renderVertex(source);

                        isoCurves.forEach(edges => {
                            edges.forEach(edge => {
                                this.renderPathAsLine(edge.vertices);
                            });
                        });
                    }

                    elapsedTime = new Date() - startTime;
                    totalTime += elapsedTime;
                    console.log(`✅ Total time ${totalTime}ms.`);

                    setTiming(totalTime);
                }
            });

            this.scene.add(object);
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

    renderPathAsMeshLine(path) {
        const geometry = new Geometry();
        path.forEach(vertex => {
            geometry.vertices.push(vertex);
        });

        const line = new MeshLine();
        line.setGeometry(geometry);

        this.scene.add(new Mesh(line.geometry, this.meshLineMaterial));
    }

    renderPathAsLine(path) {
        const geometry = new Geometry();
        path.forEach(vertex => {
            geometry.vertices.push(vertex);
        });

        const material = new LineBasicMaterial({
            color: 0x0000ff,
        });

        const line = new Line(geometry, material);
        this.scene.add(line);
    }

    renderVertex(vertex) {
        const material = new MeshPhongMaterial({ color: 0x00ff00 });

        const geometry = new SphereBufferGeometry(0.75);
        geometry.translate(vertex.x, vertex.y, vertex.z);

        const sphere = new Mesh(geometry, material);

        this.scene.add(sphere);
    }

    render() {
        const { assignment, model, qType, vertexSelection } = this.props.store;
        return (
            <Paper style={{ height: "100%" }}>
                <Grid container style={{ height: "100%" }}>
                    <div
                        aria-label={`${assignment} ${model} ${qType} ${vertexSelection}`}
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
