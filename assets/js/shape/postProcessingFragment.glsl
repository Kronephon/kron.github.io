
uniform float amount;

uniform sampler2D tDiffuse;

uniform vec2 windowsResolution;

varying vec2 vUv;
/*
vec4 cubic(float x)
{
    float x2 = x * x;
    float x3 = x2 * x;
    vec4 w;
    w.x =   -x3 + 3.0*x2 - 3.0*x + 1.0;
    w.y =  3.0*x3 - 6.0*x2       + 4.0;
    w.z = -3.0*x3 + 3.0*x2 + 3.0*x + 1.0;
    w.w =  x3;
    return w / 6.0;
}

vec4 BicubicTexture(in sampler2D tex, in vec2 coord)
{
	vec2 resolution = windowsResolution.xy;

	coord *= resolution;

	float fx = fract(coord.x);
    float fy = fract(coord.y);
    coord.x -= fx;
    coord.y -= fy;

    fx -= 0.5;
    fy -= 0.5;

    vec4 xcubic = cubic(fx);
    vec4 ycubic = cubic(fy);

    vec4 c = vec4(coord.x - 0.5, coord.x + 1.5, coord.y - 0.5, coord.y + 1.5);
    vec4 s = vec4(xcubic.x + xcubic.y, xcubic.z + xcubic.w, ycubic.x + ycubic.y, ycubic.z + ycubic.w);
    vec4 offset = c + vec4(xcubic.y, xcubic.w, ycubic.y, ycubic.w) / s;

    vec4 sample0 = texture2D(tex, vec2(offset.x, offset.z) / resolution);
    vec4 sample1 = texture2D(tex, vec2(offset.y, offset.z) / resolution);
    vec4 sample2 = texture2D(tex, vec2(offset.x, offset.w) / resolution);
    vec4 sample3 = texture2D(tex, vec2(offset.y, offset.w) / resolution);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix( mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);
}

vec3 BloomFetch(vec2 coord)
{
 	return BicubicTexture(tDiffuse, coord).rgb;   
}

vec3 Grab(vec2 coord, const float octave, const vec2 offset)
{
 	float scale = exp2(octave);
    
    coord /= scale;
    coord -= offset;

    return BloomFetch(coord);
}

vec2 CalcOffset(float octave)
{
    vec2 offset = vec2(0.0);
    
    vec2 padding = vec2(10.0) / windowsResolution.xy;
    
    offset.x = -min(1.0, floor(octave / 3.0)) * (0.25 + padding.x);
    
    offset.y = -(1.0 - (1.0 / exp2(octave))) - padding.y * octave;

	offset.y += min(1.0, floor(octave / 3.0)) * 0.35;
    
 	return offset;   
}

vec3 GetBloom(vec2 coord)
{
 	vec3 bloom = vec3(0.0);
    
    //Reconstruct bloom from multiple blurred images
    bloom += Grab(coord, 1.0, vec2(CalcOffset(0.0))) * 1.0;
    bloom += Grab(coord, 2.0, vec2(CalcOffset(1.0))) * 1.5;
	bloom += Grab(coord, 3.0, vec2(CalcOffset(2.0))) * 1.0;
    bloom += Grab(coord, 4.0, vec2(CalcOffset(3.0))) * 1.5;
    bloom += Grab(coord, 5.0, vec2(CalcOffset(4.0))) * 1.8;
    bloom += Grab(coord, 6.0, vec2(CalcOffset(5.0))) * 1.0;
    bloom += Grab(coord, 7.0, vec2(CalcOffset(6.0))) * 1.0;
    bloom += Grab(coord, 8.0, vec2(CalcOffset(7.0))) * 1.0;

	return bloom;
}*/

    /*vec4 color = texture2D( tDiffuse, vUv  );
    
    vec4 sum = vec4(0);
    vec2 texcoord = gl_FragCoord.xy/windowsResolution.xy;
    int j;
    int i;
    sum += texture2D(tDiffuse, vec2(texcoord.x - 4.0*blurSize, texcoord.y)) * 0.05;
    sum += texture2D(tDiffuse, vec2(texcoord.x - 3.0*blurSize, texcoord.y)) * 0.09;
    sum += texture2D(tDiffuse, vec2(texcoord.x - 2.0*blurSize, texcoord.y)) * 0.12;
    sum += texture2D(tDiffuse, vec2(texcoord.x - blurSize, texcoord.y)) * 0.15;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture2D(tDiffuse, vec2(texcoord.x + blurSize, texcoord.y)) * 0.15;
    sum += texture2D(tDiffuse, vec2(texcoord.x + 2.0*blurSize, texcoord.y)) * 0.12;
    sum += texture2D(tDiffuse, vec2(texcoord.x + 3.0*blurSize, texcoord.y)) * 0.09;
    sum += texture2D(tDiffuse, vec2(texcoord.x + 4.0*blurSize, texcoord.y)) * 0.05;
    
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y - 4.0*blurSize)) * 0.05;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y - 3.0*blurSize)) * 0.09;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y - 2.0*blurSize)) * 0.12;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y - blurSize)) * 0.15;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y + blurSize)) * 0.15;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y + 2.0*blurSize)) * 0.12;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y + 3.0*blurSize)) * 0.09;
    sum += texture2D(tDiffuse, vec2(texcoord.x, texcoord.y + 4.0*blurSize)) * 0.05;*/

const float blurSize = 1.0/512.0;
const float threshold = 0.5;

vec4 applyColorDodge(float intensity, vec4 colorTop, vec4 colorBottom){
    return mix(colorBottom, colorBottom / (1.0 - colorTop), intensity);
}


vec4 applyLocalAreaMask(){
    const float maxSize = 6.0; 
    vec2 size = vec2(maxSize/windowsResolution.x, maxSize/windowsResolution.y);
    vec2 pixel = vec2(1.0/windowsResolution.x, 1.0/windowsResolution.y);
    vec2 currentCoords = vUv;

    vec4 result = vec4(0.0,0.0,0.0,0.0);
    for(int x = int(-maxSize); x <= int(maxSize); x++){
        for(int y = int(-maxSize); y <= int(maxSize); y++){
            vec2 sampleCoords = vec2(currentCoords.x + float(x) * pixel.x, currentCoords.y + float(y) *pixel.y);
            //border cases
            if(sampleCoords.x < 0.0 || sampleCoords.y < 0.0 || sampleCoords.x > 1.0 || sampleCoords.y > 1.0){
                continue;
            }
            //distance cases
            vec2 d_inPixels = sampleCoords - currentCoords;
            d_inPixels.x *= windowsResolution.x;
            d_inPixels.y *= windowsResolution.y;
            if(length(d_inPixels) >= maxSize){
                continue;
            }

            //application
            result += texture2D(tDiffuse, sampleCoords);
        }
    }
    return result;
}

void main() {
    //create an area filter pass


    //determining sufficient size and color

    //applying the radial color dodge based bloom

    //make uniforms update on update size etc

    //uniform sampler2D tDiffuse;

    // applyColorDodge(1.0, vec4(1.0,1.0,1.0,1.0),baseTextureColor) ;

    vec4 baseTextureColor = texture2D( tDiffuse, vUv  );
    //if(baseTextureColor[0] >= threshold){
        gl_FragColor = applyLocalAreaMask();
    //}else{
    //    gl_FragColor = baseTextureColor;
    //}

    

}