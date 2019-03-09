import { Geometry } from "three";
import Graph from "./Graph";

function choosePoints({ vertices }) {
    let startTime, elapsedTime;

    startTime = new Date();
    console.log(`Choosing points...`);

    const source = vertices[Math.floor(Math.random() * vertices.length)];
    const target = vertices[Math.floor(Math.random() * vertices.length)];

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        source,
        target,
    };
}

export function createNormalizedNaiveGeometry({ geometry }) {
    let startTime, elapsedTime;

    startTime = new Date();
    console.log("Creating naive geometry...");

    if (geometry && !geometry.isGeometry) {
        geometry = new Geometry().fromBufferGeometry(geometry);
        geometry.mergeVertices();
    }

    if (geometry && !geometry.isGeometry) {
        geometry = new Geometry().fromBufferGeometry(geometry);
        geometry.mergeVertices();
    }

    geometry.normalize();
    geometry.scale(75, 75, 75);

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return geometry;
}

function generateGraph({ faces, vertices }) {
    let startTime, elapsedTime;

    startTime = new Date();
    console.log(`Adding vertices to the graph...`);

    const graph = new Graph(false);

    vertices.forEach(v => {
        graph.addVertex(v);
    });

    elapsedTime = new Date() - startTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    startTime = new Date();
    console.log(`Adding edges to the graph...`);

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
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        graph,
    };
}

export function prepareDataStructures({ geometry }) {
    const { graph } = generateGraph(geometry);

    const { source, target } = choosePoints(geometry);

    return {
        geometry,
        graph,
        source,
        target,
    };
}
