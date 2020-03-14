attribute float enabled;
attribute float distance;

varying float vEnabled;
varying float vDistance;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    vEnabled = enabled;
    vDistance = distance;
}