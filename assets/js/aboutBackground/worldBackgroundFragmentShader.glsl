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
    /*if(normalize(vNormal).z >= -0.90){ // make periodic 0.9 and 0.98
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }else{
        gl_FragColor = vec4(0.0,1.0,0.0,1.0);
    }*/



    float intensity = 0.5 +  random() * (normalize(vNormal).z + 0.85);
    gl_FragColor = vec4(intensity, intensity, intensity , 1.0 );
}