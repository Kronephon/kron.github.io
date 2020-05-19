uniform bool clicked;
uniform float clock;

uniform sampler2D tDiffuse;

uniform vec2 windowsResolution;

varying vec2 vUv;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec4 previousPassColor = texture2D(tDiffuse, vUv);
    if(clicked){
        if(mod(clock, 3.0) >= 1.0){
            previousPassColor = texture2D(tDiffuse, vUv + 0.04 * (random(vec2(clock, vUv.x) - 0.5)));
        }else{
            previousPassColor = texture2D(tDiffuse, vUv + 0.04 * (random(vec2(clock, vUv.y) - 0.5)));
        }
    }
    
    gl_FragColor = previousPassColor;
}