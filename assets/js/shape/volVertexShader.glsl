uniform float maxX;
uniform float maxY;
uniform float maxZ;
uniform float minX;
uniform float minY;
uniform float minZ;

uniform vec3 lightCoord;

varying vec3 worldPosition;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    worldPosition = vec3(modelMatrix * vec4(position, 1.0));
}