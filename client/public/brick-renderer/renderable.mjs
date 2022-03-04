import { mat4, vec3, vec4 } from './glm/glm.mjs';

export class Material {
    constructor(gl, colour = [0.89019607843, 0.0, 0.00392156862], shininess = 20.0) {
        this.gl = gl;
        this.colour = colour;
        this.shininess = shininess;
    }
}

export class Renderable {
    constructor(gl, shader, material = new Material()) {
        this.gl = gl;
        // TODO: Get these from the shader
        this.attributeLocations = {
            position: 0,
            normal: 1,
        };
        this.buffers = {
            vertexBuffer: null,
            normalBuffer: null,
            faceBuffer: null,
        };
        this.data = {
            verticies: [],
            normals: [],
            faces: [],
        };
        this.shader = shader;
        this.material = material;
        this.uniforms = {
            modelMatrix: mat4.create(),
            u_modelMatrix: null,
            viewMatrix: mat4.create(),
            u_viewMatrix: null,
            projectionMatrix: mat4.create(),
            u_projectionMatrix: null,
            lightPosition: vec3.create(),
            u_lightPosition: null,

            ambientLightColor: vec3.fromValues(0.2, 0.2, 0.2),
            u_ambientLightColor: null,
            diffuseLightColor: vec3.fromValues(0.8, 0.8, 0.8),
            u_diffuseLightColor: null,
            specularLightColor: vec3.fromValues(1.0, 1.0, 1.0),
            u_specularLightColor: null,
            lightIntensity: 1.0,
            u_lightIntensity: null,
            ambientIntensity: 1.0,
            u_ambientIntensity: null,
        };
    }
}

export class LegoBrickRenderable {
    
}
