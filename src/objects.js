import {
    Geometry,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshPhongMaterial,
    SphereBufferGeometry,
} from "three";
import { MeshLine } from "three.meshline";

export function createPathAsMeshLine(path, material) {
    const geometry = new Geometry();
    path.forEach(vertex => {
        geometry.vertices.push(vertex);
    });

    const line = new MeshLine();
    line.setGeometry(geometry);

    return new Mesh(line.geometry, material);
}

export function createPathAsLine(path) {
    const geometry = new Geometry();
    path.forEach(vertex => {
        geometry.vertices.push(vertex);
    });

    const material = new LineBasicMaterial({
        color: 0x0000ff,
    });

    const line = new Line(geometry, material);
    return line;
}

export function createVertex(vertex) {
    const material = new MeshPhongMaterial({ color: 0x00ff00 });

    const geometry = new SphereBufferGeometry(0.75);
    geometry.translate(vertex.x, vertex.y, vertex.z);

    const sphere = new Mesh(geometry, material);

    return sphere;
}
