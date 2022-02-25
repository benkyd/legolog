function main() {
    const canvas = document.querySelector('#webglviewer');
    const gl = canvas.getContext('webgl2');

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const vsSource = document.getElementById('vertex-draw').text.trim();
    const fsSource = document.getElementById('fragment-draw').text.trim();

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    const sceneUniformsLocation = gl.getUniformBlockIndex(program, 'SceneUniforms');
    gl.uniformBlockBinding(program, sceneUniformsLocation, 0);

    const modelMatrixLocation = gl.getUniformLocation(program, 'uModel');

    gl.useProgram(program);

    const box = utils.createBox({dimensions: [.5, .6, .5]});
    const numVertices = box.positions.length / 3;

    const cubeArray = gl.createVertexArray();
    gl.bindVertexArray(cubeArray);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, box.positions, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, box.uvs, gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(1);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, box.normals, gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(2);


    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, Math.PI / 2, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 10.0);

    const viewMatrix = mat4.create();
    const eyePosition = vec3.fromValues(1, 1, 1);
    mat4.lookAt(viewMatrix, eyePosition, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    const viewProjMatrix = mat4.create();
    mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);

    const lightPosition = vec3.fromValues(1, 1, 0.5);

    const modelMatrix = mat4.create();
    const rotateXMatrix = mat4.create();
    const rotateYMatrix = mat4.create();

    const sceneUniformData = new Float32Array(24);
    sceneUniformData.set(viewProjMatrix);
    sceneUniformData.set(eyePosition, 16);
    sceneUniformData.set(lightPosition, 20);

    const sceneUniformBuffer = gl.createBuffer();
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, sceneUniformBuffer);
    gl.bufferData(gl.UNIFORM_BUFFER, sceneUniformData, gl.STATIC_DRAW);

    let angleX = 0;
    let angleY = 0;


    function draw() {
        angleX += 0.01;
        angleY += 0.015;

        mat4.fromXRotation(rotateXMatrix, angleX);
        mat4.fromYRotation(rotateYMatrix, angleY);
        mat4.multiply(modelMatrix, rotateXMatrix, rotateYMatrix);

        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, numVertices);

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

window.onload = main;
