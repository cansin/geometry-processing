import { Graph } from "algorithms/data_structures";
import { Geometry } from "three";

function choosePoints({ vertices }) {
    let startTime,
        elapsedTime,
        totalTime = 0;

    startTime = new Date();
    console.log(`Choosing points...`);

    const source = vertexToString(
        vertices[Math.floor(Math.random() * vertices.length)],
    );
    const target = vertexToString(
        vertices[Math.floor(Math.random() * vertices.length)],
    );

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        source,
        target,
        timing: totalTime,
    };
}

function createNaiveGeometry(mesh) {
    let { geometry } = mesh;
    let startTime,
        elapsedTime,
        totalTime = 0;

    startTime = new Date();
    console.log("Creating naive geometry...");

    if (geometry && !geometry.isGeometry) {
        geometry = new Geometry().fromBufferGeometry(geometry);
        geometry.mergeVertices();
    }

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        geometry,
        timing: totalTime,
    };
}

function generateGraph({ faces, vertices }) {
    let startTime,
        elapsedTime,
        totalTime = 0;

    startTime = new Date();
    console.log(`Adding vertices to the graph...`);

    const graph = new Graph(false);

    vertices.forEach(v => {
        graph.addVertex(vertexToString(v));
    });

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
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

            graph.addEdge(
                vertexToString(vertex1),
                vertexToString(vertex2),
                vertex1.distanceTo(vertex2),
            );
        }
    }

    elapsedTime = new Date() - startTime;
    totalTime += elapsedTime;
    console.log(`\tdone in ${elapsedTime}ms.`);

    return {
        graph,
        timing: totalTime,
    };
}

function vertexToString(v) {
    return `${v.x},${v.y},${v.z}`;
}

export function prepareDataStructures(mesh) {
    const { geometry } = createNaiveGeometry(mesh);
    const { graph } = generateGraph(geometry);

    const { source, target } = choosePoints(geometry);

    return {
        geometry,
        graph,
        source,
        target,
    };
}
