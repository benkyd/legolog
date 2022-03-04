#version 300 es
precision highp float;

uniform SceneUniforms {
    mat4 viewProj;
    vec4 eyePosition;
    vec4 lightPosition;
} uView;

in vec3 vPosition;
in vec3 vNormal;

out vec4 fragColor;

// TODO: PBR
// https://github.com/Moguri/panda3d-simplepbr
void main() {
    vec3 color = vec3(0.89019607843, 0.0, 0.00392156862);
    vec3 normal = normalize(vNormal);
    
    vec3 lightDir = normalize(uView.lightPosition.xyz - vPosition);
    vec3 viewDir = normalize(uView.eyePosition.xyz - vPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 20.0);
    vec3 specular = vec3(0.3) * spec;

    float diff = max(dot(lightDir, normal), 0.0);
    vec3 diffuse = color * diff;

    vec3 ambient = color * 0.1;

    fragColor = vec4(ambient + diffuse + specular, 1.0);
}
