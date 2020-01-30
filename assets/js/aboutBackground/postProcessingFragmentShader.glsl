uniform float amount;

uniform sampler2D tDiffuse;

uniform vec2 windowsResolution;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(tDiffuse, vUv);
}