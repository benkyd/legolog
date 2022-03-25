#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec4 normal;

uniform SceneUniforms {
    mat4 viewProj;
    vec4 eyePosition;
    vec4 lightPosition;
} uView;       

uniform mat4 uModel;

out vec3 vPosition;
out vec3 vNormal;

void main() {
    vec4 worldPosition = uModel * position;
    vPosition = worldPosition.xyz;
    vNormal = (uModel * normal).xyz;
    gl_Position = uView.viewProj * worldPosition;
}
