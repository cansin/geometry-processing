import React, { Component } from "react";
import {
    AmbientLight,
    CircleGeometry,
    FaceColors,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { MeshLineMaterial } from "three.meshline";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import LineChart from "recharts/es6/chart/LineChart";
import BarChart from "recharts/es6/chart/BarChart";
import Bar from "recharts/es6/cartesian/Bar";
import ChartLine from "recharts/es6/cartesian/Line";
import autobind from "autobind-decorator";

import { OFFLoader } from "../loaders/OFFLoader";
import { createNormalizedNaiveGeometry, prepareDataStructures } from "../algorithms/helpers";
import { findGeodesicDistance } from "../algorithms/geodesic_distance";
import {
    findBilateralMap,
    findMultiSeedBilateralMap,
    findTriangularBilateralMap,
} from "../algorithms/bilateral_map";
import { ASSIGNMENTS } from "../constants";
import { farthestPointSampling } from "../algorithms/farthest_point_sampling";
import { findIsoCurveSignature } from "../algorithms/iso_curve_signature";
import { createPathAsLine, createPathAsMeshLine, createVertex } from "../objects";
import { generateMeshParameterization } from "../algorithms/mesh_parameterization";

@inject("store")
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
        this.offLoader = new OFFLoader();
        this.objLoader = new OBJLoader();

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

    @autobind
    createGeodesicScene({ graph, qType, source, target, logger }) {
        const { path } = findGeodesicDistance({
            graph,
            qType,
            source,
            target,
            logger,
        });

        this.scene.add(createPathAsMeshLine(path, this.meshLineMaterial));
        this.scene.add(createVertex(source));
        this.scene.add(createVertex(target));
    }

    @autobind
    createBilateralScene({ mesh, graph, qType, source, target, logger }) {
        mesh.material.vertexColors = FaceColors;

        const { bilateralMap, path } = findBilateralMap({
            geometry: mesh.geometry,
            graph,
            qType,
            p: source,
            q: target,
            logger,
        });

        this.scene.add(createPathAsMeshLine(path, this.meshLineMaterial));
        this.scene.add(createVertex(source, 0x00ff00));
        this.scene.add(createVertex(target, 0xff0000));

        this.props.store.setChartData({
            name: "Bilateral Descriptor",
            cartesian: Bar,
            chart: BarChart,
            data: bilateralMap,
        });
    }

    @autobind
    createMultiSeedBilateralScene({ mesh, graph, qType, logger, vertexCount }) {
        mesh.material.vertexColors = FaceColors;

        const { bilateralMap, path, points } = findMultiSeedBilateralMap({
            geometry: mesh.geometry,
            graph,
            qType,
            logger,
            vertexCount,
        });

        this.scene.add(createPathAsMeshLine(path, this.meshLineMaterial));

        let isFirst = true;
        points.forEach(vertex => {
            this.scene.add(createVertex(vertex, isFirst ? 0x00ff00 : 0xff0000));
            isFirst = false;
        });

        this.props.store.setChartData({
            name: "Bilateral Descriptor",
            cartesian: Bar,
            chart: BarChart,
            data: bilateralMap,
        });
    }

    @autobind
    createTriangularBilateralScene({ mesh, graph, qType, logger }) {
        mesh.material.vertexColors = FaceColors;

        const { paths, points } = findTriangularBilateralMap({
            geometry: mesh.geometry,
            graph,
            qType,
            logger,
        });

        paths.forEach(path => {
            this.scene.add(createPathAsMeshLine(path, this.meshLineMaterial));
        });

        let isFirst = true;
        points.forEach(vertex => {
            this.scene.add(createVertex(vertex, isFirst ? 0x00ff00 : 0xff0000));
            isFirst = false;
        });

        // this.props.store.setChartData({
        //     name: "Bilateral Descriptor",
        //     cartesian: Bar,
        //     chart: BarChart,
        //     data: bilateralMap,
        // });
    }

    @autobind
    createIsoCurveScene({ mesh, graph, qType, source, logger }) {
        const { isoCurves, isoDescriptor } = findIsoCurveSignature({
            geometry: mesh.geometry,
            graph,
            qType,
            source,
            logger,
        });

        this.scene.add(createVertex(source));
        isoCurves.forEach(edges => {
            edges.forEach(({ vertices }) => {
                this.scene.add(createPathAsMeshLine(vertices, this.meshLineMaterial));
            });
        });

        this.props.store.setChartData({
            name: "Iso-Curve Descriptor",
            cartesian: ChartLine,
            chart: LineChart,
            data: isoDescriptor,
        });
    }

    @autobind
    createFarthestPointScene({ graph, qType, source, logger }) {
        const { farthestPoints } = farthestPointSampling({
            graph,
            qType,
            source,
            count: 100,
            logger,
        });

        farthestPoints.forEach(vertex => {
            this.scene.add(createVertex(vertex));
        });
    }

    @autobind
    createMeshParameterizationScene({
        mesh,
        graph,
        weightApproach,
        boundaryShape,
        isMouthFixated,
        logger,
    }) {
        const {
            allEdges,
            initialBoundaryVertices,
            finalBoundaryVertices,
            boundaryEdges,
        } = generateMeshParameterization({
            geometry: mesh.geometry,
            graph,
            weightApproach,
            boundaryShape,
            isMouthFixated,
            logger,
        });

        const moveToRight = new Vector3(80, 0, 0),
            moveToLeft = new Vector3(-80, 0, 0);

        initialBoundaryVertices.forEach(vertex => {
            this.scene.add(createVertex(new Vector3().addVectors(vertex, moveToLeft), 0x00ff00));
        });

        boundaryEdges.forEach(({ vertices }) => {
            this.scene.add(
                createPathAsLine(
                    [
                        new Vector3().addVectors(vertices[0], moveToLeft),
                        new Vector3().addVectors(vertices[1], moveToLeft),
                    ],
                    0x00ff00,
                ),
            );
        });

        finalBoundaryVertices.forEach(vertex => {
            this.scene.add(createVertex(new Vector3().addVectors(vertex, moveToRight), 0x00ff00));
        });

        allEdges.forEach(({ vertices }) => {
            this.scene.add(
                createPathAsLine(
                    [
                        new Vector3().addVectors(vertices[0], moveToRight),
                        new Vector3().addVectors(vertices[1], moveToRight),
                    ],
                    0xff0000,
                ),
            );
        });
    }

    loadObject() {
        const {
            assignment,
            model,
            qType,
            vertexSelection,
            vertexCount,
            weightApproach,
            boundaryShape,
            isMouthFixated,
        } = this.props.store;
        const loader = model.endsWith(".off") ? this.offLoader : this.objLoader;
        const logger = this.props.store;
        let startTime,
            elapsedTime,
            totalTime = 0;

        startTime = new Date();
        logger && logger.clear();
        logger && logger.log(`Loading Object...`);
        loader.load(model, object => {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            this.scene.add(new AmbientLight(0xcccccc, 0.4));
            this.scene.add(this.camera);

            elapsedTime = new Date() - startTime;
            totalTime += elapsedTime;
            logger && logger.log(`\tdone in ${elapsedTime.toLocaleString()}ms.`);

            object.traverse(mesh => {
                if (mesh instanceof Mesh) {
                    mesh.geometry = createNormalizedNaiveGeometry({ mesh: mesh, logger });

                    mesh.material.transparent = true;
                    mesh.material.opacity = 0.9;
                    mesh.material.color.setHex(0xcccccc);

                    startTime = new Date();
                    logger && logger.log(`🌟 Calculating ${ASSIGNMENTS[assignment]}...`);

                    this.props.store.setMesh(mesh);
                    const { graph, source, target } = prepareDataStructures({
                        mesh,
                        qType,
                        vertexSelection,
                        vertexCount,
                        logger,
                    });
                    this.props.store.setGraph(graph);

                    const createScene = {
                        [ASSIGNMENTS.Geodesic]: this.createGeodesicScene,
                        [ASSIGNMENTS.Bilateral]: this.createBilateralScene,
                        [ASSIGNMENTS.MultiSeedBilateral]: this.createMultiSeedBilateralScene,
                        [ASSIGNMENTS.TriangularBilateral]: this.createTriangularBilateralScene,
                        [ASSIGNMENTS.IsoCurve]: this.createIsoCurveScene,
                        [ASSIGNMENTS.FarthestPoint]: this.createFarthestPointScene,
                        [ASSIGNMENTS.MeshParameterization]: this.createMeshParameterizationScene,
                    };

                    createScene[ASSIGNMENTS[assignment]]({
                        mesh,
                        graph,
                        qType,
                        source,
                        target,
                        logger,
                        vertexCount,
                        weightApproach,
                        boundaryShape,
                        isMouthFixated,
                    });

                    elapsedTime = new Date() - startTime;
                    totalTime += elapsedTime;
                    logger && logger.log(`✅ Total time ${totalTime.toLocaleString()}ms.`);
                }
            });

            this.scene.add(
                ASSIGNMENTS[assignment] === ASSIGNMENTS.MeshParameterization
                    ? object.translateOnAxis(new Vector3(1, 0, 0), -80)
                    : object,
            );
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

    render() {
        const {
            assignment,
            model,
            qType,
            vertexSelection,
            vertexCount,
            weightApproach,
            boundaryShape,
            isMouthFixated,
        } = this.props.store;
        return (
            <div
                aria-label={`${assignment} ${model} ${qType} ${vertexSelection} ${vertexCount} ${weightApproach} ${boundaryShape} ${isMouthFixated}`}
                style={{
                    height: "100%",
                    width: "100%",
                    minHeight: 600,
                }}
                ref={mount => {
                    this.mount = mount;
                }}
            />
        );
    }
}

export default ThreeScene;
