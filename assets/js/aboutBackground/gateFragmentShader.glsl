uniform vec3 diffuse;

varying float vEnabled;
varying float vDistance;

struct Light{
    vec3 pos;
    float intensity;
    vec3 color;
};

struct Ray{
    vec3 pos;
    vec3 dir;
};

struct RayMarchSettings{
    float minStep;
    int timeout;
};



void main() {
    gl_FragColor = vec4( diffuse, 0.0);

    RayMarchSettings rayMarchSettings = RayMarchSettings(0.1, 100);
    Ray ray = Ray(vec3(0.0,0.0,0.0), vec3(0.0,0.0,0.0));
    


}