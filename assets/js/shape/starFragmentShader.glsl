uniform float time;
varying float angle;
varying vec2 UV;

vec4 getDiffuseColor(vec2 coord, offset){
    if(floor(mod(time * 10.0, 2.0)) == 0.0){
        return vec4(1.0,1.0,1.0,0.0);
    }
    if(floor(mod(coord.x * 10.0, 2.0)) == 0.0){
        return vec4(1.0,1.0,0.0,1.0);
    }else{
        return vec4(0.0,0.0,0.0,1.0);
    }
}

void main() {
    gl_FragColor = getDiffuseColor(UV, time);
    
}