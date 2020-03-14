uniform vec3 diffuse;

varying float vEnabled;
varying float vDistance;

void main() {
    gl_FragColor = vec4( diffuse, 0.0);
    if(vDistance < 0.7){
        gl_FragColor = vec4( diffuse, 1.0 - abs(vDistance) );
    }
}