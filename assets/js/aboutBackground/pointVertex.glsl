uniform float scale;
uniform float size;

attribute float enabled;
attribute float distance;
              
varying float vOpacity;
varying float vDistance;
              
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
    vOpacity = enabled;
    vDistance = distance;
}