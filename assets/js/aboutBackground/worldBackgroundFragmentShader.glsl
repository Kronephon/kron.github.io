uniform float amount;

uniform sampler2D tDiffuse;

varying vec3 vNormal;
varying vec2 vUv;

void main() {

    gl_FragColor = vec4( vec3(0.2,0.2,0.2) * normalize( vNormal ), 1.0 );

}