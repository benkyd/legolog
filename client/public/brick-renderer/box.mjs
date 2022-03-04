
export default class Box {
    constructor(gl, options) {
        this.gl = gl;
        this.options = options;

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
    }

    get vertexCount() {
        return this.verticies;
    }

    bind() {
        this.gl.bindVertexArray(this.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    }

    create(options) {
        const { positions, normals } = this.boxVerticies(options);
        this.verticies = positions.length / 3;

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindVertexArray(this.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        this.normalBuffer = this.gl.createBuffer();
        this.gl.bindVertexArray(this.vao);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(1);
    }

    // TODO: Use indicies ffs
    boxVerticies(options) {
        options = options || {};

        const dimensions = options.dimensions || [1, 1, 1];
        const position = options.position || [-dimensions[0] / 2, -dimensions[1] / 2, -dimensions[2] / 2];
        const x = position[0];
        const y = position[1];
        const z = position[2];
        const width = dimensions[0];
        const height = dimensions[1];
        const depth = dimensions[2];

        const fbl = { x, y, z: z + depth };
        const fbr = { x: x + width, y, z: z + depth };
        const ftl = { x, y: y + height, z: z + depth };
        const ftr = { x: x + width, y: y + height, z: z + depth };
        const bbl = { x, y, z };
        const bbr = { x: x + width, y, z };
        const btl = { x, y: y + height, z };
        const btr = { x: x + width, y: y + height, z };

        const positions = new Float32Array([
            // front
            fbl.x, fbl.y, fbl.z,
            fbr.x, fbr.y, fbr.z,
            ftl.x, ftl.y, ftl.z,
            ftl.x, ftl.y, ftl.z,
            fbr.x, fbr.y, fbr.z,
            ftr.x, ftr.y, ftr.z,

            // right
            fbr.x, fbr.y, fbr.z,
            bbr.x, bbr.y, bbr.z,
            ftr.x, ftr.y, ftr.z,
            ftr.x, ftr.y, ftr.z,
            bbr.x, bbr.y, bbr.z,
            btr.x, btr.y, btr.z,

            // back
            fbr.x, bbr.y, bbr.z,
            bbl.x, bbl.y, bbl.z,
            btr.x, btr.y, btr.z,
            btr.x, btr.y, btr.z,
            bbl.x, bbl.y, bbl.z,
            btl.x, btl.y, btl.z,

            // left
            bbl.x, bbl.y, bbl.z,
            fbl.x, fbl.y, fbl.z,
            btl.x, btl.y, btl.z,
            btl.x, btl.y, btl.z,
            fbl.x, fbl.y, fbl.z,
            ftl.x, ftl.y, ftl.z,

            // top
            ftl.x, ftl.y, ftl.z,
            ftr.x, ftr.y, ftr.z,
            btl.x, btl.y, btl.z,
            btl.x, btl.y, btl.z,
            ftr.x, ftr.y, ftr.z,
            btr.x, btr.y, btr.z,

            // bottom
            bbl.x, bbl.y, bbl.z,
            bbr.x, bbr.y, bbr.z,
            fbl.x, fbl.y, fbl.z,
            fbl.x, fbl.y, fbl.z,
            bbr.x, bbr.y, bbr.z,
            fbr.x, fbr.y, fbr.z,
        ]);

        const normals = new Float32Array(positions.length);
        let ni;

        for (let i = 0, count = positions.length / 3; i < count; i++) {
            ni = i * 3;

            normals[ni] = parseInt(i / 6, 10) === 1
                ? 1
                : parseInt(i / 6, 10) === 3 ? -1 : 0;

            normals[ni + 1] = parseInt(i / 6, 10) === 4
                ? 1
                : parseInt(i / 6, 10) === 5 ? -1 : 0;

            normals[ni + 2] = parseInt(i / 6, 10) === 0
                ? 1
                : parseInt(i / 6, 10) === 2 ? -1 : 0;
        }

        return {
            positions,
            normals,
        };
    }
}
