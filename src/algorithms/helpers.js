import { Geometry } from "three";
import UndirectedWeightedGraph from "./UndirectedWeightedGraph";
import { farthestPointSampling } from "./farthest_point_sampling";
import { VERTEX_SELECTIONS } from "../constants";

function choosePointsRandomly({ geometry, logger }) {
    const { vertices } = geometry;
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Choosing points...`);

    const source = vertices[Math.floor(Math.random() * vertices.length)];
    const target = vertices[Math.floor(Math.random() * vertices.length)];

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    return {
        source,
        target,
    };
}

function chooseFarthestPoints({ geometry, graph, qType, vertexCount, logger }) {
    const { vertices } = geometry;
    const [source, target] = farthestPointSampling({
        graph,
        qType,
        source: vertices[0],
        count: vertexCount,
        logger,
    }).farthestPoints;

    return {
        source,
        target,
    };
}

function generateGraph({ geometry, logger }) {
    const { faces, vertices } = geometry;
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log(`Adding vertices to the graph...`);

    const graph = new UndirectedWeightedGraph();

    vertices.forEach(v => {
        graph.addVertex(v);
    });

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    logger && logger.log(`Adding edges to the graph...`);

    // Adopted from `three/src/geometries/WireframeGeometry.js:31`
    const keys = ["a", "b", "c"];

    for (let i = 0, l = faces.length; i < l; i++) {
        let face = faces[i];

        for (let j = 0; j < 3; j++) {
            const vertexIndex1 = face[keys[j]];
            const vertexIndex2 = face[keys[(j + 1) % 3]];
            const vertex1 = vertices[Math.min(vertexIndex1, vertexIndex2)];
            const vertex2 = vertices[Math.max(vertexIndex1, vertexIndex2)];

            graph.addEdge(vertex1, vertex2, vertex1.distanceTo(vertex2));
        }
    }

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    return {
        graph,
    };
}

export function createNormalizedNaiveGeometry({ mesh, logger }) {
    let { geometry } = mesh;
    let startTime, elapsedTime;

    startTime = new Date();
    logger && logger.log("Creating naive geometry...");

    if (geometry && !geometry.isGeometry) {
        geometry = new Geometry().fromBufferGeometry(geometry);
        geometry.mergeVertices();
    }

    geometry.normalize();
    geometry.scale(75, 75, 75);

    elapsedTime = new Date() - startTime;
    logger && logger.log(`\tdone in ${elapsedTime}ms.`);

    return geometry;
}

export function prepareDataStructures({ mesh, qType, vertexSelection, vertexCount, logger }) {
    const { geometry } = mesh;
    const { graph } = generateGraph({ geometry, logger });

    let choosePoints;

    if (VERTEX_SELECTIONS[vertexSelection] === VERTEX_SELECTIONS.Random) {
        choosePoints = choosePointsRandomly;
    } else if (VERTEX_SELECTIONS[vertexSelection] === VERTEX_SELECTIONS.FarthestPoint) {
        choosePoints = chooseFarthestPoints;
    }

    const { source, target } = choosePoints({ geometry, graph, qType, vertexCount, logger });

    return {
        geometry,
        graph,
        source,
        target,
    };
}
