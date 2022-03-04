import { mat4, vec3 } from './glm/glm.mjs';
import Shader from './shader.mjs';
import Box from './box.mjs';
import LoadObj from './wavefront-obj.mjs';

let BasicVsource, BasicFSource;

let LegoStudObjSource, LegoStudObjParseResult;

export async function RendererPreInit() {
    BasicFSource = await fetch('./brick-renderer/basic.fs').then(r => r.text());
    BasicVsource = await fetch('./brick-renderer/basic.vs').then(r => r.text());
    LegoStudObjSource = await fetch('./res/lego_stud.obj').then(r => r.text());
    LegoStudObjParseResult = LoadObj(LegoStudObjSource);
    console.log(LegoStudObjParseResult);
}

class BaseRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.clearColor(0.84313, 0.76078, 1.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.shader = new Shader(this.gl, BasicVsource, BasicFSource);
        this.shader.link();

        WebGLDebugUtils.init(this.gl);
    }
}

export class BrickRenderer extends BaseRenderer {
    constructor(canvas, options) {
        super(canvas);

        this.angleX = 0;
        this.angleY = 0;

        // random number between 0 and 0.1
        this.dx = Math.random() * 0.09;
        this.dy = Math.random() * 0.09;


        /////////////////////////
        // TESTING LEGO STUDS //

        this.VAO = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.VAO);

        this.VBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.VBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, LegoStudObjParseResult.vertices, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(0);

        const nVBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, nVBO);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, LegoStudObjParseResult.normals, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(1);

        this.EBO = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, LegoStudObjParseResult.indices, this.gl.STATIC_DRAW);

        // TESTING LEGO STUDS //
        /////////////////////////


        this.sceneUniformLocation = this.shader.getUniformBlock('SceneUniforms');
        this.modelMatrixLocation = this.shader.getUniform('uView');
        this.shader.attatch();

        this.boxObj = new Box(this.gl, { dimensions: [0.5, 0.6, 0.5] });
        this.boxObj.create();

        const projMatrix = mat4.create();
        mat4.perspective(projMatrix, Math.PI / 2, this.gl.drawingBufferWidth / this.gl.drawingBufferHeight, 0.1, 10.0);

        const viewMatrix = mat4.create();
        const eyePosition = vec3.fromValues(1, 1, 1);
        mat4.lookAt(viewMatrix, eyePosition, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

        const viewProjMatrix = mat4.create();
        mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);

        const lightPosition = vec3.fromValues(1, 1, 0.5);

        this.modelMatrix = mat4.create();
        this.rotateXMatrix = mat4.create();
        this.rotateYMatrix = mat4.create();
        const sceneUniformData = new Float32Array(24);
        sceneUniformData.set(viewProjMatrix);
        sceneUniformData.set(eyePosition, 16);
        sceneUniformData.set(lightPosition, 20);

        const sceneUniformBuffer = this.gl.createBuffer();
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, sceneUniformBuffer);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, sceneUniformData, this.gl.STATIC_DRAW);

        requestAnimationFrame(this.draw.bind(this));
    }

    draw() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.angleX += this.dx;
        this.angleY += this.dy;

        mat4.fromXRotation(this.rotateXMatrix, this.angleX);
        mat4.fromYRotation(this.rotateYMatrix, this.angleY);
        mat4.multiply(this.modelMatrix, this.rotateXMatrix, this.rotateYMatrix);

        this.gl.uniformMatrix4fv(this.modelMatrixLocation, false, this.modelMatrix);

        this.gl.bindVertexArray(this.VAO);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        this.gl.drawElements(this.gl.TRIANGLES, LegoStudObjParseResult.indices.length * 3, this.gl.UNSIGNED_SHORT, 0);

        // this.boxObj.bind();
        // this.gl.drawArrays(this.gl.TRIANGLES, 0, this.boxObj.vertexCount);

        if (this.gl.getError() !== this.gl.NO_ERROR) {
            console.error(WebGLDebugUtils.glEnumToString(this.gl.getError()));
        }

        requestAnimationFrame(this.draw.bind(this));
    }
}
