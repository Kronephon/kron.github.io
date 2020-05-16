uniform float clock;

varying vec3 vNormal;
varying vec2 vUv;


void main() {
    
    gl_FragColor = 0.5 * vec4(29.0/255.0,45.0/255.0,68.0/255.0,1.0);

    /*float random = random();
    if(random <= 0.3){
        gl_FragColor = vec4(1.0, 0.0, 0.0 , 1.0 );
    }else{
        gl_FragColor = vec4(intensity, intensity, intensity , 1.0 );
    }*/
    
}