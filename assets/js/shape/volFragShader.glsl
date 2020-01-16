uniform float time;
varying vec3 worldPosition;
varying vec3 viewDirection;

/// utilities

bool sphereHit (vec3 p)
{
    return distance(p,vec3(0,0,0)) < 1.0;
}

#define STEP_SIZE 0.01
 
bool raymarchHit (vec3 in_position, vec3 direction)
{
    for (int i = 0; i < 2000; i++)
    {
    if ( sphereHit(in_position) )
        return true;
 
        in_position += direction * STEP_SIZE;
    }
    return false;
}

void main() {
    if(raymarchHit(worldPosition, viewDirection)){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0); 
    }else{
        gl_FragColor = vec4(0.0,0.0,1.0,0.5); 
    }


}