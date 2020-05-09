varying vec3 worldPosition;
varying float vEnabled;
varying float vDistance;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    worldPosition = vec3(modelMatrix * vec4(position, 1.0));
}