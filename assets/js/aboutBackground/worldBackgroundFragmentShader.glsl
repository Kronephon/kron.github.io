uniform float clock;

varying vec3 vNormal;
varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float random(){
    float a = mod(clock, 3.0);
    if(a <= 1.0){
        return rand(vec2(clock, vNormal.x));
    } else if(a <= 2.0) {
        return rand(vec2(clock, vNormal.y));
    } else {
        return rand(vec2(clock, vNormal.z));
    }
}

float randomOverlay(float ZZ){
    
float top = -0.965;
    float tip = sin(clock * 0.5) * (-0.9 - top) + -0.9;
    
    if(ZZ < top){
        return 1.0;
    }else{
        return min(max((ZZ - tip)/(top - tip), 0.0), 1.0) ;
    }
}

void main() {




    /*if(normalize(vNormal).z >= -0.9){ // make periodic 0.9 and 0.98
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }else{
      
    }*/
    float ran = 0.1 * random() * randomOverlay(normalize(vNormal).z);
    gl_FragColor = ran + vec4(0.1,0.1,0.1,1.0);
    /*float random = random();
    if(random <= 0.3){
        gl_FragColor = vec4(1.0, 0.0, 0.0 , 1.0 );
    }else{
        gl_FragColor = vec4(intensity, intensity, intensity , 1.0 );
    }*/
    
}