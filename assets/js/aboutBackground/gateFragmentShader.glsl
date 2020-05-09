uniform vec3 diffuse;
varying vec3 worldPosition;

struct Light{
    vec3 pos;
    float intensity;
    vec3 color;
};

struct Ray{
    vec3 pos;
    vec3 dir;
};

const float minStep = 0.005;
const int timeout = int(1.0/minStep) * 10;


vec4 rayMarch(Ray ray){
    vec4 result = vec4(1.0,0.0,0.0,0.0);
    vec3 pos = ray.pos;
    vec3 dir = ray.dir;
    for(int i = 0; i < timeout ; ++i){
        if(length(pos) > 1.001){
            break;
        }
        if(result.w >= 1.0){
            break;
        }
        if(length(pos) < 1.0 && length(pos) > 0.9){
            //result += vec4(0.001,0.001,0.001,0.001);
        }
        if(length(pos) < 0.9 && length(pos) > 0.8){
            //result += vec4(0.01,0.01,0.01,0.01);
        }
        if(length(pos) <= 0.8){
            //result += vec4(-0.01,-0.01,-0.01,0.01);
        }
        //ray.pos += ray.dir * minStep;
        pos = pos + dir * minStep;

    }

    return result;// = vec4(length(pos),length(pos),length(pos),1.0);
}

void main() {
    //gl_FragColor = vec4( 29.0/255.0,45.0/255.0,68.0/255.0, 1.0);

    Ray ray = Ray(worldPosition, normalize(worldPosition - cameraPosition));
    vec4 result = rayMarch(ray);
    gl_FragColor = result;
}