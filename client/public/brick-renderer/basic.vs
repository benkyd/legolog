#version 300 es

layout(std140, column_major) uniform;

layout(location=0) in vec4 position;
layout(location=1) in vec4 normal;

uniform SceneUniforms {
    mat4 viewProj;
    vec4 eyePosition;
    vec4 lightPosition;
} uScene;       

uniform mat4 uModel;

out vec3 vPosition;
out vec3 vNormal;

void main() {
    vec4 worldPosition = uModel * position;
    vPosition = worldPosition.xyz;
    vNormal = (uModel * normal).xyz;
    gl_Position = uScene.viewProj * worldPosition;
}
