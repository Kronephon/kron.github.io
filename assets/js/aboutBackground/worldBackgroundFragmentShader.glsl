uniform float clock;

varying vec3 vNormal;
varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float random(){
    return rand(vec2(clock, vNormal.x));
}

void main() {
    gl_FragColor = vec4(- normalize( vNormal ).y * 0.2 + random() * 0.1, random() * 0.05, - normalize( vNormal ).y * 0.2 + random() * 0.1 , 1.0 );
}