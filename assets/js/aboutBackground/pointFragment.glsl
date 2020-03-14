uniform vec3 diffuse;

varying float vOpacity;
varying float vDistance;
        
void main() {
    if(vDistance > 0.2){
        gl_FragColor = vec4( diffuse, vOpacity  );
    }else{
        if(vDistance < 0.05){
            discard;
        }
        gl_FragColor = vec4( diffuse, vDistance  );
    }
}