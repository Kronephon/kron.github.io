uniform vec3 colorAmbient;            
uniform vec3 colorDiffuse;
uniform vec3 colorSpecular;
uniform float clock;
uniform float distortionFactor;
varying vec3 worldPosition;

const float EPSILON = 0.1;

struct Light{
    vec3 pos;
    float intensity;
    vec3 color;
};

struct Ray{
    vec3 pos;
    vec3 dir;
};

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdRoundCone( vec3 p, float r1, float r2, float h )
{
  vec2 q = vec2( length(p.xy), p.z );
    
  float b = (r1-r2)/h;
  float a = sqrt(1.0-b*b);
  float k = dot(q,vec2(-b,a));
    
  if( k < 0.0 ) return length(q) - r1;
  if( k > a*h ) return length(q-vec2(0.0,h)) - r2;
        
  return dot(q, vec2(a,b) ) - r1;
}

float sdEllipsoid( vec3 p, vec3 r )
{
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}

float intersectSDF(float distA, float distB) {
    return max(distA, distB);
}

float unionSDF(float distA, float distB) {
    return min(distA, distB);
}

float differenceSDF(float distA, float distB) {
    return max(distA, -distB);
}

float smoothUnionSDF( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}

float smoothSubtractionSDF( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); 
}

float smoothIntersectionSDF( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h); 
}

/*
float opDisplace( in sdf3d primitive, in vec3 p )
{
    float d1 = primitive(p);
    float d2 = displacement(p);
    return d1+d2;
}


float opTwist( in sdf3d primitive, in vec3 p )
{
    const float k = 10.0; // or some other amount
    float c = cos(k*p.y);
    float s = sin(k*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
    return primitive(q);
}

float opCheapBend( in sdf3d primitive, in vec3 p )
{
    const float k = 10.0; // or some other amount
    float c = cos(k*p.x);
    float s = sin(k*p.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return primitive(q);
}*/
// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 3

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

#define maxSphere sdSphere(point, 1.0)

float sceneSDF(vec3 point){
    float shapeSphere = sdSphere(point, 0.8);
    float shapeCenter = sdSphere(point, 0.2);
    float cone = sdRoundCone(point, 0.2, 0.79, 0.9);

    float halfMoon = smoothSubtractionSDF(cone, shapeSphere, 0.3);
    float halfMoonC = smoothSubtractionSDF(shapeCenter, halfMoon, 0.1);
    
    //float dispT = 0.25  * sin(clock*0.1) + 0.25  * (cos(clock*0.2 + 0.3) + 0.08);
    
    float final = 0.25 * distortionFactor * (fbm(point.xy) + 0.02 *fbm(vec2(0.3* clock, 20.0 * point.z)));
    //float displacement = sin(disp*point.x)*sin(disp*point.y)*sin(disp*point.z);
    //float displacement = noise(vec2(disp, disp));
    //float removeCenter = smoothSubtractionSDF(sdSphere(point, 0.01), shapeOrigin + displacement, 1.0);
    return smoothIntersectionSDF(maxSphere, halfMoonC  - final, 0.01);
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

vec3 shade(vec3 point, vec3 direction){ // using phong for now

    float specularity = 1.0;
    float diffuse = 1.0;
    float ambient = 1.0;
    float shinniness = 10.0;

    vec3 ambientColor = colorAmbient;
    vec3 diffuseColor = colorDiffuse;
    vec3 specularColor = colorSpecular;
    
    Light mainLight = Light(vec3(0.0,0.0,0.0),  abs(distortionFactor), vec3(1.0,1.0,1.0));
    vec3 lightVector = normalize(mainLight.pos - point);
    vec3 normal  = normalize(estimateNormal(point));
    vec3 reflected = normalize(2.0 * dot(lightVector, normal) * normal - lightVector);
 
    vec3 ambientSection = ambient * ambientColor;
    vec3 diffuseSection = diffuse * (dot(lightVector, normal)) * diffuseColor;

    vec3 specularSection = vec3(0.0,0.0,0.0);   
    if(dot(reflected, normalize(-direction)) > 0.0){
        specularSection = clamp(specularity * pow((dot(reflected, normalize(-direction))), shinniness) * specularColor, 0.0,1.0);
    }
    
    return max(ambientSection + mainLight.intensity * diffuseSection + specularSection, ambientSection);
}

vec4 rayMarch(Ray ray){
    const float minStep = 0.04;
    const int timeout = int(1.0/minStep) * 10;

    vec4 result = vec4(0.0,0.0,0.0,0.0);
    vec4 extra = vec4(0.0,0.0,0.0,0.0);
    vec3 pos = ray.pos;
    vec3 dir = ray.dir;
    for(int i = 0; i < timeout ; ++i){
        if(length(pos) > 1.00){
            break;
        }
        if(result.w >= 1.0){
            break;
        }
        float dist = sceneSDF(pos);

        
        if(dist <= 0.1){
            extra += vec4(0.04,0.02,0.02,0.05);
        }
        
        if(dist <= 0.0){
            result = vec4(shade(pos, dir),1.0);
        }
        pos = pos + dir * max(dist, minStep);

    }

    return extra + result;
}

void main() {
    //gl_FragColor = vec4( 29.0/255.0,45.0/255.0,68.0/255.0, 1.0);

    Ray ray = Ray(worldPosition, normalize(worldPosition - cameraPosition));
    vec4 result = rayMarch(ray);
    gl_FragColor = result;
}