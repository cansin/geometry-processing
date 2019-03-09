import { vertexToString } from "./generate_graph";

export function choosePoints({ vertices }) {
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
