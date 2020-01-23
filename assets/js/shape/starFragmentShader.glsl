uniform float time;

uniform float minX;
uniform float minY;
uniform float minZ;

uniform float maxX;
uniform float maxY;
uniform float maxZ;

uniform float starRadius;
uniform float starRotationSpeed;

uniform vec3 starColor;
uniform vec3 starEdgeColor;
uniform vec3 starEmission;

uniform vec3 meshPosition;

varying vec3 worldPosition;


#define STEP_SIZE 0.01

vec4 densityProbe(vec3 in_position){
    if(distance(in_position , meshPosition) <= starRadius){
        return vec4(starEdgeColor, 0.08);
    }else{
        return vec4(0.0,0.0,0.0,0.0);
    }

}
	
float sphereDistance (vec3 p)
{
    return distance(p,meshPosition) - starRadius;
}

vec4 volumetricRayCast (vec3 in_position, vec3 direction)
{
    vec4 sample = vec4(0 , 0 , 0 , 0.0);
    vec3 position = in_position;

    for (int i = 0; i < 1000; i++) // change this to smart book lookup
    {
        if(position.x > maxX || position.x < minX ){
            break;
        }
        if(position.y > maxY || position.y < minY ){
            break;
        }
        if(position.z > maxZ || position.z < minZ ){
            break;
        }
        if(sample[3] > 1.0){
            break;
        }
        vec4 local = densityProbe(position);
        //vec4 local = localDensitySample(vec3(vec4(in_position,0.0) * rotm));
        sample += local;
        //vec4 localLight = localDensitySample(in_position, lightCoord);
        float distance = sphereDistance(position);
        if(distance > STEP_SIZE){
            position += distance * direction;
        }else{
            position += direction * STEP_SIZE;
        }
    }

    return sample;
}

void main() {
    
    vec2 uv = gl_FragCoord.xy; // gl_Viewport.xy;
    //vec3 color = pow(texture(iChannel0, uv).rgb * colorRange, vec3(2.2));

    gl_FragColor = volumetricRayCast( worldPosition, normalize(worldPosition - cameraPosition)); 

}