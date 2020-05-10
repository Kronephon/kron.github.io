uniform float clock;

varying vec3 vNormal;
varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float random(){
    float a = mod(clock, 3.0);
    if(a <= 1.0){
        return rand(vec2(a, vNormal.x));
    } else if(a <= 2.0) {
        return rand(vec2(a, vNormal.y));
    } else {
        return rand(vec2(a, vNormal.z));
    }
}

float randomOverlay(float ZZ){
    
float top = -0.965;
    float tip = sin(clock * 0.25) * (-0.94 - top) + -0.86;
    
    if(ZZ < top){
        return 1.0;
    }else{
        return min(max((ZZ - tip)/(top - tip), 0.0), 1.0) ;
    }
}

void main() {
    float ran = 1.0 * random() * randomOverlay(normalize(vNormal).z);
    if(ran < 0.7){
        ran = 0.0;
    }

    vec4 colorCenter = vec4( 29.0/255.0,45.0/255.0,68.0/255.0, 1.0);
    
    gl_FragColor = mix(ran * colorCenter, vec4(23.0/255.0,29.0/255.0,33.0/255.0,1.0), 0.5);

    /*float random = random();
    if(random <= 0.3){
        gl_FragColor = vec4(1.0, 0.0, 0.0 , 1.0 );
    }else{
        gl_FragColor = vec4(intensity, intensity, intensity , 1.0 );
    }*/
    
}