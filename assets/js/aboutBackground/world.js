class KrWorld {
    constructor(gateShader, backgroundShader) {

        this.clock = new THREE.Clock();
        this.clock.start();

        const sphereCenterRadius = 1.0;

        this.colorBackground = new THREE.Color("rgb(29, 45, 68)");

        this.colorCoreAmbient = new THREE.Color("rgb(14, 22, 34)");
        this.colorCoreDiffuse = new THREE.Color("rgb(23, 36, 54)");
        this.colorCoreSpecular = new THREE.Color("rgb(255, 196, 164)");

       /* this.colorCoreAmbient     = THREE.Color("rgb(29,45,68)");
        this.colorCoreDiffuse     = THREE.Color("rgb(29,45,68)");
        this.colorCoreSpecularity = THREE.Color("rgb(29,45,68)");*/




        this.sphereCenter = this.setupCore(sphereCenterRadius, gateShader);

        this.artifacts = this.setupArtifacts(0.03, 10, 2.0, 1.0, 0.5, sphereCenterRadius);

        this.background = this.setupBackground(backgroundShader);

        var light = new THREE.PointLight(0xf1f9c7, 10);
        light.position.set(0, 0, 0);
        scene_sp.add(light);

        var geometry = new THREE.DodecahedronBufferGeometry(0.01, 6);
        var material = new THREE.MeshBasicMaterial({color:0xffffff});
        var lightmesh = new THREE.Mesh(geometry, material);
        lightmesh.geometry.translate(0.3,0.0,1.3);
        scene_sp.add(lightmesh);
        this.starfield = new Stars_sp();
    }

    setupCore(radius, shader){
        var geometry = new THREE.DodecahedronBufferGeometry(radius, 6);

        let uniforms = {
            colorAmbient: {type: 'vec3', value: this.colorCoreAmbient},
            colorDiffuse: {type: 'vec3', value: this.colorCoreDiffuse},
            colorSpecular: {type: 'vec3', value: this.colorCoreSpecular},
            clock: {type: 'float', value: this.clock.getElapsedTime()}
        };
        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader[0],
            fragmentShader: shader[1],
            side: THREE.FrontSide,
            transparent: true,
            depthTest: true
        });
        var sphere = new THREE.Mesh( geometry, material );
        //sphere.geometry.computeVertexNormals();
        scene_sp.add( sphere );
        return sphere;
    }

    setupArtifacts(sizeElement, numberOfArtifacts, outerBoundRegion, internalFactor1 , internalFactor2, innerBoundRegion){
        var artifacts = new THREE.Group();

        var material = new THREE.MeshStandardMaterial( {
            color: 0xa7a3d4,
            metalness: 1.00,
            roughness: 0.0,
            blending:  THREE.AdditiveBlending,
            transparent: true,
            depthTest: true,
            opacity: 0.0001       
        } );
        var geometry = new THREE.OctahedronBufferGeometry(sizeElement, 3);
        geometry.scale(0.3,0.3,10);
        for(var i = 0; i <= numberOfArtifacts; ++i){

            var artifact = new THREE.Mesh( geometry.clone(), material.clone() );
            
            var x = (Math.random()-0.5) * outerBoundRegion * 2;
            var y = (Math.random()-0.5) * outerBoundRegion * 2;
            var z = (Math.random()-0.5) * outerBoundRegion * 2;
            
            while( x*x + y*y + z*z < (innerBoundRegion + sizeElement *  20) * (innerBoundRegion + sizeElement *  20) ||
                   x*x + y*y + z*z > (outerBoundRegion) * (outerBoundRegion)){
                x = (Math.random()-0.5) * outerBoundRegion * 2;
                y = (Math.random()-0.5) * outerBoundRegion * 2;
                z = (Math.random()-0.5) * outerBoundRegion * 2;
            }
            artifact.position.x = x;
            artifact.position.y = y;
            artifact.position.z = z;

            artifact.lookAt(0,0,0);
            artifacts.add( artifact );
            //artifact.geometry.computeVertexNormals();

        }
        scene_sp.add(artifacts);
        return artifacts;
    }

    updateArtifacts(){
        this.artifacts.rotateY(0.0002);
        for ( var a = 1; a < this.artifacts.children.length; a ++ ) {
            this.artifacts.children[a].rotateZ(0.06 );
            if (Math.random() < 0.3) {
                var intensity = 0.004;
                this.artifacts.children[a].translateX((Math.random() - 0.5) * intensity);
                this.artifacts.children[a].translateY((Math.random() - 0.5) * intensity);
                this.artifacts.children[a].translateZ((Math.random() - 0.5) * intensity);
            }


            this.artifacts.children[a].material.opacity = 0.8 + (Math.random() - 0.5) * 0.2;
            
            this.artifacts.children[a].rotateOnAxis(new THREE.Vector3(0,0,1), Math.random());

            this.artifacts.children[a].lookAt(0,0,0);

        }
        //this.artifacts.children[0].intensity = Math.abs(Math.sin(this.clock.getElapsedTime()));
    }

    setupBackground(backgroundShader){
        var geometry = new THREE.DodecahedronBufferGeometry(20, 6);

        let uniforms = {
            clock: {type: 'float', value: this.clock.getElapsedTime()}
        };
        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: backgroundShader[0],
            fragmentShader: backgroundShader[1],
            side: THREE.BackSide,
            transparent: false,
            depthTest: false
          });
        var sphere = new THREE.Mesh( geometry, material );
        //sphere.geometry.computeVertexNormals();
        scene_sp.add( sphere );
        return sphere;
    }

    updateBackground(){
        this.background.material.uniforms.clock.value = this.clock.getElapsedTime();
    }

    updateCore(){
        this.sphereCenter.material.uniforms.clock.value = this.clock.getElapsedTime();
    }

    update() {
        this.updateArtifacts();
        this.updateBackground();
        this.updateCore();
        this.starfield.update();
    }
}

// class responsible for background stars
const NUMBER_OF_STARS_SP = 90000;
const ZBACK_SP = -10;


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
        var x = 20;
        var y = 20;
        var z = 5;
        for(var i= 0; i < NUMBER_OF_STARS_SP*3; i = i + 3){
            
            vertices[i] = (Math.random() - 0.5)*x;
            vertices[i+1] = (Math.random() - 0.5)*y;
            vertices[i+2] = (Math.random() - 0.5)*z + ZBACK_SP;

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
                starclass[i]   = STAR_BLUE.r;
                starclass[i+1] = STAR_BLUE.g;
                starclass[i+2] = STAR_BLUE.b;
            }
            //shine
            if(Math.random() <= 0.005){
                shine[i/3] = Math.random() * 0.7;
            }else{
                shine[i/3] = Math.random() * 0.3;
            }
            
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
                                            blending: THREE.AdditiveBlending//, 
                                            //depthTest: true, transparent: true,
                                            });

        mat.onBeforeCompile = shader => {
            shader.uniforms.time = this.pointsUniforms.time;
            shader.vertexShader = `
            uniform float time;
            attribute float shine;
            varying float vShine;
            ` + shader.vertexShader;
            
            shader.vertexShader = shader.vertexShader.replace(
                `gl_PointSize = size;`,
                `
                float shineCalc = cos((time + shine * 5000.0)/8.0)/0.5 + 0.5;
                gl_PointSize = size * shine * 0.03 ;
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
        this.starmap.rotation.z += 0.000003;
    }
}