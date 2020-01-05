uniform float time;
varying float angle;
varying vec2 UV;

float fastRand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 getDiffuseColor(vec2 coord, float offset){

    if(floor(mod(offset * 10.0,10.0)) == 0.0){
        return vec4(1.0,1.0,1.0,0.0);
    }
    if(floor(mod(coord.x * 10.0, 2.0)) == 0.0){
        return vec4(1.0,1.0,0.0,1.0);
    }else{
        return vec4(0.0,0.0,0.0,fastRand(coord));
    }
}

void main() {
    gl_FragColor = getDiffuseColor(UV, time);   
}