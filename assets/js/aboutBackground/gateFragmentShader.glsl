uniform vec3 colorAmbient;            
uniform vec3 colorDiffuse;
uniform vec3 colorSpecular;
uniform float clock;
uniform float distortionFactor;
varying vec3 worldPosition;

const float EPSILON = 0.0001;

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

float opSubtraction( float d1, float d2 ) { return max(-d1,d2); }

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
/*float noise (in vec2 _st) {
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

#define NUM_OCTAVES 2

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
} */


// rotation matrix for fbm octaves
mat3 m = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );

float hash( float n )
{
    return fract(sin(n)*43758.5453123);
}

// 3d noise function
float noise( in vec3 x )
{
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}

// fbm noise for 2-4 octaves including rotation per octave
float fbm( vec3 p )
{
    float f = 0.0;
    f += 0.5000*noise( p );
	p = m*p*2.02;
    f += 0.2500*noise( p ); 
// set to 1 for 2 octaves	
#if 2	
	return f/0.75;
#else	
	p = m*p*2.03;
    f += 0.1250*noise( p );
// set to 1 for 3 octaves, 0 for 4 octaves	
#if 0
	return f/0.875;
#else	
	p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
#endif	
#endif	
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

#define maxSphere sdSphere(point, 1.0)

float sceneSDF(vec3 point){
    float shapeSphere = sdSphere(point, 0.8);
    float shapeCenter = sdSphere(point, 0.2);
    float shapeHollow = opSubtraction(shapeCenter, shapeSphere);
    mat4 rot = rotationMatrix(vec3(sin(clock), sin(clock), cos(clock)), abs(distortionFactor * 2.929));
    vec3 rotPoint = vec3(dot(vec4(point,0.0), rot[0]),dot(vec4(point,0.0), rot[1]),dot(vec4(point,0.0), rot[2]));
    float smoothed= smoothIntersectionSDF(shapeHollow, shapeCenter - fbm(0.4 + distortionFactor * 5.3 * rotPoint), 0.1 );
    return smoothIntersectionSDF(maxSphere, smoothed, 0.9);



    /*float shapeCenter = sdSphere(point, 0.2);
    float cone = sdRoundCone(point, 0.2, 0.79, 0.9);

    float halfMoon = smoothSubtractionSDF(cone, shapeSphere, 0.3);
    float halfMoonC = smoothSubtractionSDF(shapeCenter, halfMoon, 0.1);

    mat4 rot = rotationMatrix(vec3(sin(clock), sin(clock), cos(clock)), 0.929);
    //fl5 * fbm distortion = 0.03 * sin(clock*point.x)*cos(clock*point.y)*sin(clock*point.z);

    vec3 rotPoint = vec3(dot(vec4(point,0.0), rot[0]),dot(vec4(point,0.0), rot[1]),dot(vec4(point,0.0), rot[2]));
    float distortion = 0.35 * fbm( 5.0 *distortionFactor * rotPoint );
    float mixer = halfMoon - distortion;
    //float mixer2 = smoothSubtractionSDF(mixer, halfMoonC, 0.4);
    return smoothIntersectionSDF(maxSphere, mixer, 0.9);*/
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
    float shinniness = 50.0;

    vec3 ambientColor = colorAmbient;
    //vec3 diffuseColor = colorDiffuse;
    //vec3 specularColor = colorSpecular;
    
    //Light mainLight = Light(vec3(0.0,0.0,0.0),  abs(distortionFactor), vec3(1.0,1.0,1.0));
    //vec3 lightVector = normalize(mainLight.pos - point);
    //vec3 normal  = normalize(estimateNormal(point));
    //vec3 reflected = normalize(2.0 * dot(lightVector, normal) * normal - lightVector);
 
    vec3 ambientSection = ambient * ambientColor;
    //vec3 diffuseSection = diffuse * (dot(lightVector, normal)) * diffuseColor;

    //vec3 specularSection = vec3(0.0,0.0,0.0);   
    //if(dot(reflected, normalize(-direction)) > 0.0){
    //    specularSection = clamp(specularity * pow((dot(reflected, normalize(-direction))), shinniness) * specularColor, 0.0,1.0);
    //}
    
    //return max(ambientSection + mainLight.intensity * diffuseSection + specularSection, ambientSection);
    return ambientSection;
}

vec4 rayMarch(Ray ray){
    const float minStep = 0.0001;
    const int timeout = 100;

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
        
        if(dist <= abs(distortionFactor)){
            extra += vec4(0.047,0.027,0.027,0.02);
        }
        if(length(pos) < 0.50 && dist < 0.03){
                extra += mix(vec4(0.0,0.0,0.0,0.0), vec4(0.02,0.002,0.02,0.6),abs(1.00 - length(pos)));
                dir = normalize(mix(normalize(-pos), dir, abs(0.50 - length(pos))));
            //break;
        }
        
        if(dist <= EPSILON){
            result = vec4(shade(pos, dir),1.0);
            break;
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