varying vec3 worldPosition;
varying vec3 viewDirection;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    worldPosition = vec3(modelMatrix * vec4(position, 1.0));
    viewDirection = normalize(worldPosition - cameraPosition);

}