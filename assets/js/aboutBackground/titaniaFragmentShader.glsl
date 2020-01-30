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

void main(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec3 color = ColorFetch(uv);
    
    
    color += GetBloom(uv) * 0.08;
    
    color *= 200.0;
    

    //Tonemapping and color grading
    color = pow(color, vec3(1.5));
    color = color / (1.0 + color);
    color = pow(color, vec3(1.0 / 1.5));

    
    color = mix(color, color * color * (3.0 - 2.0 * color), vec3(1.0));
    color = pow(color, vec3(1.3, 1.20, 1.0));    

	color = saturate(color * 1.01);
    
    color = pow(color, vec3(0.7 / 2.2));

    fragColor = vec4(color, 1.0);

}