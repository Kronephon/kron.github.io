class KrWorld {
    constructor(gateShader, backgroundShader) {

        this.clock = new THREE.Clock();
        this.clock.start();

        const sphereCenterRadius = 1.0;

        this.sphereCenter = this.setupCore(sphereCenterRadius, gateShader);

        this.artifacts = this.setupArtifacts(0.03, 100, 2.0, 1.0, 0.5, sphereCenterRadius);

        this.background = this.setupBackground(backgroundShader);

        var light = new THREE.PointLight(0xf1f9c7, 10);
        light.position.set(0, 0, 0);
        scene_sp.add(light);
    }

    setupCore(radius, shader){
        var geometry = new THREE.DodecahedronBufferGeometry(radius, 6);

        let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
        };
        let material =  new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: shader[0],
            fragmentShader: shader[1],
            side: THREE.BackSide,
            transparent: true
          });
        var sphere = new THREE.Mesh( geometry, material );
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
            opacity: 0.8        
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
            side: THREE.BackSide
          });
        var sphere = new THREE.Mesh( geometry, material );
        scene_sp.add( sphere );
        return sphere;
    }

    updateBackground(){
        this.background.material.uniforms.clock.value = this.clock.getElapsedTime();
    }

    update() {
        this.updateArtifacts();
        this.updateBackground();
    }
}