import {
    DefaultLoadingManager,
    Face3,
    FileLoader,
    Geometry,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    Vector3,
} from "three";

function OFFLoader(manager) {
    this.manager = manager !== undefined ? manager : DefaultLoadingManager;
}

Object.assign(OFFLoader.prototype, {
    load: function(url, onLoad, onProgress, onError) {
        const loader = new FileLoader(this.manager);

        loader.load(
            url,
            function(data) {
                function vector(x, y, z) {
                    return new Vector3(x, y, z);
                }

                function face3(a, b, c, normals) {
                    return new Face3(a, b, c, normals);
                }

                function calcNormal(v1, v2, v3) {
                    // cross product - calculate 2 vectors, then cross
                    const vector1 = [v1.x - v2.x, v1.y - v2.y, v1.z - v2.z];

                    const vector2 = [v3.x - v2.x, v3.y - v2.y, v3.z - v2.z];

                    const xProduct = vector(
                        vector1[1] * vector2[2] - vector1[2] * vector2[1],
                        vector1[2] * vector2[0] - vector1[0] * vector2[2],
                        vector1[0] * vector2[1] - vector1[1] * vector2[0],
                    );
                    return xProduct;
                }

                const group = new Object3D();
                const vertices = [];

                const pattern = /OFF/g;
                const result = pattern.exec(data);

                data = data.split("\n");

                // 1st line: OFF
                if (result == null) return null;

                // 2nd line: vertex_count face_count edge_count
                const str = data[1].toString().replace("\r", "");
                const listCount = str.split(" ");
                const countVertex = parseInt(listCount[0]);
                const countFace = parseInt(listCount[1]);

                // list of vertex
                for (let cv = 0; cv < countVertex; cv++) {
                    const str = data[cv + 2].toString().replace("\r", "");
                    const listVertex = str.split(" ");
                    vertices.push(
                        vector(
                            parseFloat(listVertex[0]),
                            parseFloat(listVertex[1]),
                            parseFloat(listVertex[2]),
                        ),
                    );
                }

                // list of faces
                for (let cf = 0; cf < countFace; cf++) {
                    const str = data[cf + countVertex + 2]
                        .toString()
                        .replace("\r", "");
                    const listFace = str.split(" ");

                    const geometry = new Geometry();
                    geometry.vertices = vertices;

                    const v1 = parseInt(listFace[1]);
                    const v2 = parseInt(listFace[2]);
                    const v3 = parseInt(listFace[3]);
                    // flat shading
                    const n = calcNormal(
                        vertices[v1],
                        vertices[v2],
                        vertices[v3],
                    );
                    const f = face3(v1, v2, v3, [n, n, n]);

                    geometry.faces.push(f);
                    group.add(new Mesh(geometry, new MeshPhongMaterial()));
                }

                onLoad(group);
            },
            onProgress,
            onError,
        );
    },
});

export { OFFLoader };
