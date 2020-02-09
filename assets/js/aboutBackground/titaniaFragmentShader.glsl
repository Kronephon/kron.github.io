uniform float time;

uniform float minX;
uniform float minY;
uniform float minZ;

uniform float maxX;
uniform float maxY;
uniform float maxZ;

uniform float radius;
uniform float starRotationSpeed;

uniform vec3 starColor;
uniform vec3 starEdgeColor;
uniform vec3 starEmission;

uniform vec3 meshPosition;
uniform vec3 cameraVelocity;

varying vec3 worldPosition;


/// simplified version
const float gargantuaMass = 1.0;
const float speedOfLight = 10.0;
const float graviticConstant = 1.0;
const int stepTimeOut = 2000;
float simulationRadius = maxX;
const float minStep = 0.1;
const float schwarzschild = 4.07;
const float plankconstant = 0.00001;


int trajectoryApproximator(vec3 out_pos, vec3 out_dir){
    //%%%%AUTOMATEDAREASTART1
    //%%%%AUTOMATEDAREAEND1
    return 0;
}

// dynamically filled area
vec3 trajectoryQuery(int trajectoryIndex, int step){
    //%%%%AUTOMATEDAREASTART2
    //%%%%AUTOMATEDAREAEND2
    return vec3(0.0,0.0,0.0);
}

// convert coordinates to polar. assumes origin is at 0,0,0
// of in_pos
vec3 toPolar(vec3 in_pos){
    float r = length(in_pos);
    float t = acos(in_pos.x/sqrt(in_pos.x*in_pos.x + in_pos.y*in_pos.y));
    float p = asin(in_pos.y/sqrt(in_pos.x*in_pos.x + in_pos.y*in_pos.y));
    return vec3(r,t,p);
}

vec3 toCartesian(vec3 in_pos){
    return vec3(in_pos.x*sin(in_pos.y)*cos(in_pos.z),
                in_pos.x*sin(in_pos.y)*sin(in_pos.z),
                in_pos.x*cos(in_pos.y));
}

vec4 getCelestialSphereValue(vec2 in_coords){ // TODO
    return vec4(sin(in_coords.x + time), cos(in_coords.x - time),sin(in_coords.y * time),1.0);
}

mat3 rayStep(vec3 in_rayPosition, vec3 in_rayDirection, float distance){    //TODO

    vec3 position = in_rayPosition + in_rayDirection * minStep;
    return mat3(position, in_rayDirection, vec3(1.0,1.0,1.0));
}

float distanceToTravel(vec3 in_rayPosition, vec3 in_rayDirection){ // TODO
    return minStep;
}

bool outerBound(vec3 in_rayPosition, vec3 in_rayDirection){ // TODO
    if(toPolar(in_rayPosition).x > simulationRadius){
        return true;
    }
    return false;
}

vec4 sampleColor(){
    vec3 rayPosition = worldPosition;
    vec3 rayDirection = normalize(worldPosition - cameraPosition);

    for(int i = 0 ; i < stepTimeOut; i++){
        float distanceToStep = distanceToTravel(rayPosition,rayDirection);
        mat3 newRay = rayStep(rayPosition, rayDirection, distanceToStep);
        rayPosition = newRay[0];
        rayDirection = newRay[1];
        if(toPolar(rayPosition).x <= schwarzschild){ // shortcut
            break;
        }
        if(outerBound(rayPosition, rayDirection)){
            return getCelestialSphereValue(toPolar(rayPosition).yz);
        }
    }
    return vec4(0.0,0.0,0.0,1.0);
}

///

float rand(vec2 co){
    return sin(co.x);
}

#define STEP_SIZE 0.01

vec4 densityProbe(vec3 in_position){
    if(distance(in_position , meshPosition) <= radius){
        return vec4(starEdgeColor, 0.08);
    }else{
        return vec4(0.0,0.0,0.0,0.0);
    }

}

float sphereDistance (vec3 p, vec3 center, float r)
{
    return distance(p,center) - r;
}

#define BACKGROUND_RADIUS 100.0 // hmmm

vec4 getBackground(vec3 out_position, vec3 direction){
    
    for (int i = 0; i < 2000; i++) // change this to smart book lookup
    {
        float distanceToSphere = sphereDistance(out_position, vec3(0.0,0.0,0.0), BACKGROUND_RADIUS);
        direction = direction;

        if(distanceToSphere < 0.0){
            out_position += distanceToSphere * direction;
        }else{
            return getCelestialSphereValue(toPolar(out_position).yz); //todo clamp might be needed
        }
    }
    return vec4(0.0,0.0,0.0,1.0);
}

vec4 volumetricRayCast (vec3 in_position, vec3 direction)
{
    vec4 sample = vec4(0 , 0 , 0 , 0.0);
    vec3 position = in_position;

    for (int i = 0; i < 2000; i++) // change this to smart book lookup
    {
        if(position.x > maxX || position.x < minX ){
            return sample += getBackground(in_position, direction);
        }
        if(position.y > maxY || position.y < minY ){
            return sample += getBackground(in_position, direction);
        }
        if(position.z > maxZ || position.z < minZ ){
            return sample += getBackground(in_position, direction);
        }
        if(sample[3] > 1.0){
            break;
        }
        vec4 local = vec4(0.0,0.0,0.0,0.0);//densityProbe(position);
        //vec4 local = localDensitySample(vec3(vec4(in_position,0.0) * rotm));
        
        float distance = sphereDistance(position, meshPosition, radius);

        if(distance > STEP_SIZE){
            vec3 gravityVector = vec3(0.0,0.0,0.0) - position;
            float rayDistance = length(gravityVector);

            // 0.05: rate of smaller steps when approaching blackhole
            float stepSize = min(STEP_SIZE, rayDistance - 0.3 * 0.05);

            direction += gravityVector * 0.1 / (rayDistance * rayDistance * rayDistance);
            position += distance * direction;
            local = vec4(0.0,0.0,0.0,0.05);
            sample += local;

        }else{
            position += direction * STEP_SIZE;
        }
    }

    return sample;
}

void main()
{
    //gl_FragColor = vec4(1.0,1.0,0.0,1.0);
    //gl_FragColor = sampleColor();
    gl_FragColor = volumetricRayCast( worldPosition, normalize(worldPosition - cameraPosition)); 
}