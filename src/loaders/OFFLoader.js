import {
    DefaultLoadingManager,
    Face3,
    FileLoader,
    Geometry,
    Mesh,
    MeshPhongMaterial,
    Vector3,
} from "three";

function OFFLoader(manager) {
    this.manager = manager !== undefined ? manager : DefaultLoadingManager;
}

Object.assign(OFFLoader.prototype, {
    load: function (url, onLoad, onProgress, onError) {
        const loader = new FileLoader(this.manager);
        // eslint-disable-next-line no-unused-vars
        let areColorsExist = false;
        // eslint-disable-next-line no-unused-vars
        let areNonTriangularFacesExist = false;

        loader.load(
            url,
            function (rawData) {
                const [off, counts, ...data] = rawData.split(/\r\n?|\n/);

                // Line 1
                //     OFF
                if (off !== "OFF") {
                    return null;
                }

                // Line 2
                //     vertex_count face_count edge_count
                const [vertexCount, faceCount] = counts.split(/\s+/).map(Number);

                const geometry = new Geometry();

                // One line for each vertex:
                //     x y z
                //     for vertex 0, 1, ..., vertex_count-1
                for (let v = 0; v < vertexCount; v++) {
                    const [x, y, z, ...colors] = data[v].split(/\s+/).map(Number);
                    if (colors) {
                        areColorsExist = true;
                    }

                    geometry.vertices.push(new Vector3(x, y, z));
                }

                // One line for each polygonal face:
                //     n v1 v2 ... vn,
                //     the number of vertices, and the vertex indices for each face.
                for (let f = vertexCount; f < vertexCount + faceCount; f++) {
                    const [n, ...datum] = data[f].split(/\s+/).map(Number);
                    const [i1, i2, i3] = datum.splice(0, n);

                    const v1 = geometry.vertices[i1];
                    const v2 = geometry.vertices[i2];
                    const v3 = geometry.vertices[i3];

                    const d1 = new Vector3().subVectors(v2, v1);
                    const d2 = new Vector3().subVectors(v3, v2);
                    const normal = new Vector3().crossVectors(d1, d2);

                    const colors = datum.splice(n);
                    if (colors) {
                        areColorsExist = true;
                    }
                    if (n !== 3) {
                        areNonTriangularFacesExist = true;
                    }

                    geometry.faces.push(new Face3(i1, i2, i3, normal));
                }

                onLoad(new Mesh(geometry, new MeshPhongMaterial()));
            },
            onProgress,
            onError,
        );
    },
});

export { OFFLoader };
