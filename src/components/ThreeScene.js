import React, { Component } from "react";
import {
    AmbientLight,
    BoxBufferGeometry,
    Color,
    FaceColors,
    Font,
    FontLoader,
    Mesh,
    MeshPhongMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    TextGeometry,
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
import ScatterChart from "recharts/es6/chart/ScatterChart";
import Scatter from "recharts/es6/cartesian/Scatter";
import { FibonacciHeap } from "@tyriar/fibonacci-heap";

import { OFFLoader } from "../loaders/OFFLoader";
import { createNormalizedNaiveGeometry, prepareDataStructures } from "../algorithms/helpers";
import { dijkstra, findGeodesicDistance, traverse } from "../algorithms/geodesic_distance";
import { findBilateralMap } from "../algorithms/bilateral_map";
import { ASSIGNMENTS, BILATERAL_BUCKET_SIZE, FARTHEST_POINT_SAMPLING_COUNT } from "../constants";
import { farthestPointSampling } from "../algorithms/farthest_point_sampling";
import { findIsoCurveSignature } from "../algorithms/iso_curve_signature";
import { createPathAsLine, createPathAsMeshLine, createVertex } from "../objects";
import { generateMeshParameterization } from "../algorithms/mesh_parameterization";
import { findMultiSeedBilateralMap } from "../algorithms/multi_seed_bilateral_map";
import { findTriangularBilateralMap } from "../algorithms/triangular_bilateral_map";
import helvetikerRegularFont from "../../fonts/helvetiker_regular.typeface.json";
import isometry1AllDescriptors from "../../meshes/meshes_0001.isometry.1_all_bilateral_descriptors.json";
import null0AllDescriptors from "../../meshes/meshes_0001.null.0_all_bilateral_descriptors";

import { downloadFile } from "./ModeChooser";

function compareTriangularBilateralDescriptors(sourceVertexDescriptor, targetVertexDescriptor) {
    let distance = 0;
    let sourceVertexFlatDescriptor = [];
    let targetVertexFlatDescriptor = [];

    for (let i = 0; i < BILATERAL_BUCKET_SIZE; i++) {
        for (let j = 0; j < BILATERAL_BUCKET_SIZE; j++) {
            if (sourceVertexDescriptor[i][j]) {
                sourceVertexFlatDescriptor.push(sourceVertexDescriptor[i][j]);
            }
            if (targetVertexDescriptor[i][j]) {
                targetVertexFlatDescriptor.push(targetVertexDescriptor[i][j]);
            }
        }
    }

    sourceVertexFlatDescriptor.forEach(sourceVertexValue => {
        targetVertexFlatDescriptor.forEach(targetVertexValue => {
            distance += Math.pow(sourceVertexValue - targetVertexValue, 2);
        });
    });

    return Math.sqrt(distance);
}

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
        this.fontLoader = new FontLoader();

        this.font = new Font(helvetikerRegularFont);

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
            cartesianDataKey: "y",
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
        points.filter(Boolean).forEach(vertex => {
            this.scene.add(createVertex(vertex, isFirst ? 0x00ff00 : 0xff0000));
            isFirst = false;
        });

        this.props.store.setChartData({
            name: "Multi-Seed Bilateral Descriptor",
            cartesian: Bar,
            cartesianDataKey: "y",
            chart: BarChart,
            data: bilateralMap,
        });
    }

    @autobind
    createTriangularBilateralScene({
        mesh,
        graph,
        qType,
        logger,
        sourceVertexIndexPromise,
        target1VertexIndexPromise,
        target2VertexIndexPromise,
    }) {
        Promise.all([
            sourceVertexIndexPromise,
            target1VertexIndexPromise,
            target2VertexIndexPromise,
        ]).then(([sourceVertexIndex, target1VertexIndex, target2VertexIndex]) => {
            mesh.material.vertexColors = FaceColors;

            const { bilateralMap, paths, points } = findTriangularBilateralMap({
                geometry: mesh.geometry,
                graph,
                qType,
                logger,
                sourceVertexIndex,
                target1VertexIndex,
                target2VertexIndex,
            });

            paths.filter(Boolean).forEach(path => {
                this.scene.add(createPathAsMeshLine(path, this.meshLineMaterial));
            });

            let isFirst = true;
            points.filter(Boolean).forEach(vertex => {
                this.scene.add(createVertex(vertex, isFirst ? 0x00ff00 : 0xff0000));
                isFirst = false;
            });

            this.props.store.setBilateralDescriptor(bilateralMap);

            this.props.store.setChartData({
                name: "Triangular Bilateral Descriptor",
                cartesian: Scatter,
                cartesianDataKey: "z",
                chart: ScatterChart,
                data: bilateralMap.filter(Boolean),
            });
        });
    }

    @autobind
    createTriangularBilateralRegionsScene({ model, mesh, graph, qType, source, logger }) {
        const { farthestPoints, farthestPointIndices } = farthestPointSampling(
            qType,
            source,
            FARTHEST_POINT_SAMPLING_COUNT,
        );

        mesh.material.vertexColors = FaceColors;

        const bilateralDescriptors = {};

        farthestPoints.forEach((source, sourceI) => {
            const queue = new FibonacciHeap();
            const sourceIndex = farthestPointIndices[sourceI];
            const { distances, previous } = dijkstra(qType, source, farthestPoints);

            farthestPoints.forEach((target, targetI) => {
                if (source !== target) {
                    const { distance, path } = traverse(distances, previous, source, target);

                    queue.insert(distance, {
                        target,
                        targetIndex: farthestPointIndices[targetI],
                        path,
                    });
                }
            });

            const { targetIndex: target1Index } = queue.extractMinimum().value;
            const { targetIndex: target2Index } = queue.extractMinimum().value;

            const { bilateralMap, paths, points } = findTriangularBilateralMap({
                geometry: mesh.geometry,
                graph,
                qType,
                logger,
                sourceVertexIndex: sourceIndex,
                target1VertexIndex: target1Index,
                target2VertexIndex: target2Index,
            });

            paths.filter(Boolean).forEach(path => {
                this.scene.add(createPathAsMeshLine(path, this.meshLineMaterial));
            });

            let isFirst = true;
            points.filter(Boolean).forEach(vertex => {
                this.scene.add(createVertex(vertex, isFirst ? 0x00ff00 : 0xff0000));
                isFirst = false;
            });

            const matrixDim = BILATERAL_BUCKET_SIZE;

            const matrix = new Array(matrixDim).fill(0);
            matrix.map((row, index) => {
                matrix[index] = new Array(matrixDim).fill(0);
            });

            bilateralMap.filter(Boolean).forEach(datum => {
                matrix[datum.x][datum.y] = datum.z;
            });

            bilateralDescriptors[sourceIndex] = matrix;
        });

        downloadFile(
            JSON.stringify(bilateralDescriptors),
            `${model.slice(0, -4)}_all_bilateral_descriptors.json`,
        );
    }

    @autobind
    createTriangularBilateralComparisonScene({ mesh, logger }) {
        let colorHue = 0;
        const alreadyMatchedTargets = new Set();
        Object.keys(null0AllDescriptors).forEach(sourceVertexIndex => {
            const sourceVertex = mesh.geometry.vertices[sourceVertexIndex];
            const sourceVertexDescriptor = null0AllDescriptors[sourceVertexIndex];

            let minDistance = Infinity;
            let mostSimilarVertexIndex = undefined;
            Object.keys(isometry1AllDescriptors).forEach(targetVertexIndex => {
                const targetVertexDescriptor = isometry1AllDescriptors[targetVertexIndex];

                const distance = compareTriangularBilateralDescriptors(
                    sourceVertexDescriptor,
                    targetVertexDescriptor,
                );

                if (distance < minDistance && !alreadyMatchedTargets.has(targetVertexIndex)) {
                    mostSimilarVertexIndex = targetVertexIndex;
                    minDistance = distance;
                }
            });

            alreadyMatchedTargets.add(mostSimilarVertexIndex);
            logger &&
                logger.log(
                    `Source ${sourceVertexIndex} index matches with target ${mostSimilarVertexIndex} index.`,
                );

            const mostSimilarVertex = mesh.geometry.vertices[mostSimilarVertexIndex];
            const color = new Color(`hsl(${colorHue * 3.6}, 100%, 50%)`);

            this.scene.add(createVertex(sourceVertex, color, BoxBufferGeometry));

            this.scene.add(createVertex(mostSimilarVertex, color));

            const material = new MeshPhongMaterial({ color });
            let geometry = new TextGeometry(`${colorHue}`, {
                font: this.font,
            });
            geometry.scale(0.02, 0.02, 0.02);
            geometry.rotateX(1.57);
            geometry.translate(sourceVertex.x, sourceVertex.y, sourceVertex.z);
            this.scene.add(new Mesh(geometry, material));

            geometry = new TextGeometry(`${colorHue}`, {
                font: this.font,
            });
            geometry.scale(0.02, 0.02, 0.02);
            geometry.rotateX(1.57);
            geometry.translate(mostSimilarVertex.x, mostSimilarVertex.y, mostSimilarVertex.z);
            this.scene.add(new Mesh(geometry, material));

            colorHue++;
        });
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
            cartesianDataKey: "y",
            chart: LineChart,
            data: isoDescriptor,
        });
    }

    @autobind
    createFarthestPointScene({ qType, source }) {
        const { farthestPoints, farthestPointIndices } = farthestPointSampling(
            qType,
            source,
            FARTHEST_POINT_SAMPLING_COUNT,
        );

        farthestPoints.forEach(vertex => {
            this.scene.add(createVertex(vertex));
        });

        farthestPoints.forEach((vertex, i) => {
            const material = new MeshPhongMaterial({ color: 0x00ffff });
            const geometry = new TextGeometry(`${farthestPointIndices[i]}`, {
                font: this.font,
            });
            geometry.scale(0.02, 0.02, 0.02);
            geometry.rotateX(1.57);
            geometry.translate(vertex.x, vertex.y, vertex.z);

            this.scene.add(new Mesh(geometry, material));
        });

        this.props.store.setFarthestPointIndices(farthestPointIndices);
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
            sourceVertexIndexPromise,
            target1VertexIndexPromise,
            target2VertexIndexPromise,
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

                    const { graph, source, target } = prepareDataStructures({
                        mesh,
                        qType,
                        vertexSelection,
                        vertexCount,
                        logger,
                    });

                    const createScene = {
                        [ASSIGNMENTS.Geodesic]: this.createGeodesicScene,
                        [ASSIGNMENTS.Bilateral]: this.createBilateralScene,
                        [ASSIGNMENTS.MultiSeedBilateral]: this.createMultiSeedBilateralScene,
                        [ASSIGNMENTS.TriangularBilateral]: this.createTriangularBilateralScene,
                        [ASSIGNMENTS.TriangularBilateralRegions]: this
                            .createTriangularBilateralRegionsScene,
                        [ASSIGNMENTS.TriangularBilateralComparison]: this
                            .createTriangularBilateralComparisonScene,
                        [ASSIGNMENTS.IsoCurve]: this.createIsoCurveScene,
                        [ASSIGNMENTS.FarthestPoint]: this.createFarthestPointScene,
                        [ASSIGNMENTS.MeshParameterization]: this.createMeshParameterizationScene,
                    };

                    createScene[ASSIGNMENTS[assignment]]({
                        model,
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
                        sourceVertexIndexPromise,
                        target1VertexIndexPromise,
                        target2VertexIndexPromise,
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
        const { submitCount } = this.props.store;
        return (
            <div
                aria-label={submitCount}
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
