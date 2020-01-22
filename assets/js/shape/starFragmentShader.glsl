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


float sphereSDF(vec3 p) {
    return length(p) - 1.0;
}

#define MAX_MARCHING_STEPS 100
#define EPSILON 0.002

float raymarch(vec3 in_position, vec3 in_direction){
    float depth = in_position;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * viewRayDirection);
        if (dist < EPSILON) {
            // We're inside the scene surface!
            return depth;
        }
        // Move along the view ray
        depth += dist;

        if (depth >= end) {
            // Gone too far; give up
            return end;
        }
    }
    return end;
}

void main()
{
    gl_FragColor = gl_FragColor = raymarch( worldPosition, normalize(worldPosition - cameraPosition)); 
}