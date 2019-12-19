// class responsible for background stars
const NUMBER_OF_STARS_SP = 60000;
const ZBACK_SP = -500;


//http://www.isthe.com/chongo/tech/astro/HR-temp-mass-table-byhrclass.html

const STAR_BLUE = new THREE.Color("rgb(153, 176, 255)");
const STAR_WHITE = new THREE.Color("rgb(252, 248, 255)");
const STAR_YELLOW = new THREE.Color("rgb(255, 231, 196)");
const STAR_ORANGE = new THREE.Color("rgb(255, 210, 142)");
const STAR_RED = new THREE.Color("rgb(255, 198, 108)");

const STAR_B = 0.30
const STAR_W = 0.40;
const STAR_Y = 0.15;
const STAR_O = 0.10;
const STAR_R = 0.10;

class Stars_sp{
    constructor(){
        this.clock = new THREE.Clock();
        var vertices = new Float32Array(NUMBER_OF_STARS_SP * 3);
        var starclass = new Float32Array(NUMBER_OF_STARS_SP * 3);
        var shine = new Float32Array(NUMBER_OF_STARS_SP);
        var x = 3000;
        var y = 1000;
        for(var i= 0; i<NUMBER_OF_STARS_SP*3; i = i + 3){
            vertices[i] = (Math.random() - 0.5)*x;
            vertices[i+1] = (Math.random() - 0.5)*y;
            vertices[i+2] = ZBACK_SP;

            //color
            
            var c = new THREE.Color();
            var classType = Math.random();
            
            if(classType <= STAR_R){
                starclass[i] = STAR_RED.r;
                starclass[i+1] = STAR_RED.g;
                starclass[i+2] = STAR_RED.b;
            }else if(classType <= STAR_R+STAR_O){
                starclass[i] = STAR_ORANGE.r;
                starclass[i+1] = STAR_ORANGE.g;
                starclass[i+2] = STAR_ORANGE.b;
            }else if(classType <= STAR_R+STAR_O+STAR_Y){
                starclass[i] = STAR_YELLOW.r;
                starclass[i+1] = STAR_YELLOW.g;
                starclass[i+2] = STAR_YELLOW.b;
            }else if(classType <= STAR_R+STAR_O+STAR_Y+STAR_W){
                starclass[i] = STAR_WHITE.r;
                starclass[i+1] = STAR_WHITE.g;
                starclass[i+2] = STAR_WHITE.b;
            }else {
                starclass[i] = STAR_BLUE.r;
                starclass[i+1] = STAR_BLUE.g;
                starclass[i+2] = STAR_BLUE.b;
            }
            //shine
            shine[i/3] = Math.random() * 0.3;
            starclass[i] *= shine[i/3];
            starclass[i+1] *= shine[i/3];
            starclass[i+2] *= shine[i/3];

        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute( "color", new THREE.BufferAttribute(starclass, 3));
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ));
        geometry.setAttribute( 'shine', new THREE.BufferAttribute( shine, 1 ));

        this.pointsUniforms = {
            time: {value: 0}
        }

        var mat = new THREE.PointsMaterial({vertexColors: THREE.VertexColors,
                                            blending: THREE.AdditiveBlending, 
                                            depthTest: true, transparent: true});

        mat.onBeforeCompile = shader => {
            shader.uniforms.time = this.pointsUniforms.time;
            shader.vertexShader = `
            uniform float time;
            attribute float shine;
            varying float vShine;
            
            ` + shader.vertexShader;
            
            shader.vertexShader = shader.vertexShader.replace(
                `gl_PointSize = size;`,
                `float shineCalc = sin((time + shine * 5000.0)/5.0)/0.5 + 0.5;
                gl_PointSize = size;
                vShine = shineCalc;
                `
            );
            shader.fragmentShader = `
                varying float vShine;
            ` + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace(
                `outgoingLight = diffuseColor.rgb;`,
            `
            /*if(vShine < diffuseColor.rgb[0] &&
                vShine < diffuseColor.rgb[1] &&
                vShine < diffuseColor.rgb[2]){*/
                    outgoingLight = mix(vec3(0), diffuseColor.rgb, vShine);
            /*}else{
                outgoingLight = diffuseColor.rgb;
            }*/
            
            `
            ) 
        }                                            
                                            
        this.starmap = new THREE.Points(geometry, mat);
        scene_sp.add(this.starmap);
        //console.log(this.starmap);
    }
    update(){
        this.pointsUniforms.time.value = this.clock.getElapsedTime();
    }
}