import * as glm from './glm.mjs';
import Shader from './shader.mjs';
import Box from './box.mjs';

let BasicVsource, BasicFSource;

export async function RendererPreInit() {
    BasicFSource = await fetch('./brick-renderer/basic.fs').then(r => r.text());
    BasicVsource = await fetch('./brick-renderer/basic.vs').then(r => r.text());
}

class BaseRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');
        this.gl.viewport(0, 0, canvas.width, canvas.height);
        this.gl.clearColor(0.84313, 0.76078, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.shader = new Shader(this.gl, BasicVsource, BasicFSource);
        this.shader.link();
    }
}

export class BrickRenderer extends BaseRenderer {
    constructor(canvas, options) {
        super(canvas);

        const sceneUniformLocation = this.shader.getUniformBlock('SceneUniforms');
        const modelMatrixLocation = this.shader.getUniform('uModel');
        this.shader.attatch();

        const boxObj = new Box(this.gl, { dimensions: [0.5, 0.6, 0.5] });

        const projMatrix = glm.mat4.create();
        glm.mat4.perspective(projMatrix, Math.PI / 2, this.gl.drawingBufferWidth / this.gl.drawingBufferHeight, 0.1, 10.0);

        const viewMatrix = glm.mat4.create();
        const eyePosition = glm.vec3.fromValues(1, 1, 1);
        glm.mat4.lookAt(viewMatrix, eyePosition, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0, 1, 0));

        const viewProjMatrix = glm.mat4.create();
        glm.mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);

        const lightPosition = glm.vec3.fromValues(1, 1, 0.5);

        const modelMatrix = glm.mat4.create();
        const rotateXMatrix = glm.mat4.create();
        const rotateYMatrix = glm.mat4.create();
        const sceneUniformData = new Float32Array(24);
        sceneUniformData.set(viewProjMatrix);
        sceneUniformData.set(eyePosition, 16);
        sceneUniformData.set(lightPosition, 20);

        const sceneUniformBuffer = this.gl.createBuffer();
        this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, 0, sceneUniformBuffer);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, sceneUniformData, this.gl.STATIC_DRAW);

        let angleX = 0;
        let angleY = 0;

        function draw() {
            angleX += 0.01;
            angleY += 0.015;

            glm.mat4.fromXRotation(rotateXMatrix, angleX);
            glm.mat4.fromYRotation(rotateYMatrix, angleY);
            glm.mat4.multiply(modelMatrix, rotateXMatrix, rotateYMatrix);

            this.gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, boxObj.vertexCount);

            requestAnimationFrame(draw);
        }

        requestAnimationFrame(draw);
    }
}
