
export default class Shader {
    constructor(gl, vSource, fSource) {
        this.gl = gl;
        this.vSource = vSource;
        this.fSource = fSource;
        this.uniformBlockNum = 0;
        this.shaderProgram = 123;

        this.vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vShader, this.vSource);
        this.gl.compileShader(this.vShader);

        if (!this.gl.getShaderParameter(this.vShader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(this.vShader));
        }

        this.fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fShader, this.fSource);
        this.gl.compileShader(this.fShader);

        if (!this.gl.getShaderParameter(this.fShader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(this.fShader));
        }
    }

    get vertexShader() {
        return this.vShader;
    }

    get fragmentShader() {
        return this.fShader;
    }

    get program() {
        return this.shaderProgram;
    }

    getUniformBlock(name) {
        const location = this.gl.getUniformBlockIndex(this.shaderProgram, name);
        this.gl.uniformBlockBinding(this.shaderProgram, location, this.uniformBlockNum);
        this.uniformBlockNum++;

        return location;
    }

    getUniform(name) {
        return this.gl.getUniformLocation(this.shaderProgram, name);
    }

    attribLocation(location, name) {
        this.gl.bindAttribLocation(this.shaderProgram, location, name);
    }

    setUniform(uniform, value) {
        switch (uniform.type) {
        case this.gl.FLOAT:
            this.gl.uniform1f(uniform, value);
            break;
        case this.gl.FLOAT_VEC2:
            this.gl.uniform2f(uniform, value[0], value[1]);
            break;
        case this.gl.FLOAT_VEC3:
            this.gl.uniform3f(uniform, value[0], value[1], value[2]);
            break;
        case this.gl.FLOAT_VEC4:
            this.gl.uniform4f(uniform, value[0], value[1], value[2], value[3]);
            break;
        case this.gl.INT:
            this.gl.uniform1i(uniform, value);
            break;
        case this.gl.INT_VEC2:
            this.gl.uniform2i(uniform, value[0], value[1]);
            break;
        case this.gl.INT_VEC3:
            this.gl.uniform3i(uniform, value[0], value[1], value[2]);
            break;
        case this.gl.INT_VEC4:
            this.gl.uniform4i(uniform, value[0], value[1], value[2], value[3]);
            break;
        case this.gl.BOOL:
            this.gl.uniform1i(uniform, value);
            break;
        case this.gl.BOOL_VEC2:
            this.gl.uniform2i(uniform, value[0], value[1]);
            break;
        case this.gl.BOOL_VEC3:
            this.gl.uniform3i(uniform, value[0], value[1], value[2]);
            break;
        case this.gl.BOOL_VEC4:
            this.gl.uniform4i(uniform, value[0], value[1], value[2], value[3]);
            break;
        case this.gl.FLOAT_MAT2:
            this.gl.uniformMatrix2fv(uniform, false, value);
            break;
        case this.gl.FLOAT_MAT3:
            this.gl.uniformMatrix3fv(uniform, false, value);
            break;
        case this.gl.FLOAT_MAT4:
            this.gl.uniformMatrix4fv(uniform, false, value);
            break;
        case this.gl.SAMPLER_2D:
            this.gl.uniform1i(uniform, value);
            break;
        case this.gl.SAMPLER_CUBE:
            this.gl.uniform1i(uniform, value);
            break;
        default:
            console.error(`Unsupported uniform type ${uniform.type}`);
        }
    }

    link() {
        this.shaderProgram = this.gl.createProgram();
        this.gl.attachShader(this.shaderProgram, this.vShader);
        this.gl.attachShader(this.shaderProgram, this.fShader);
        this.gl.linkProgram(this.shaderProgram);

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramParameter(this.shaderProgram));
        }
    }

    attatch() {
        this.gl.useProgram(this.shaderProgram);
    }
}
