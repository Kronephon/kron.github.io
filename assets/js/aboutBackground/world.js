class KrWorld {
    constructor(gateShader) {
        
        this.clock = new THREE.Clock();
        this.clock.start();

        const sphereCenterRadius = 1.0;

        this.sphereCenter = this.setupCore(sphereCenterRadius, gateShader);

        this.setupArtifacts(0.03, 25, 2.0, 1.0, 0.5, sphereCenterRadius);

        this.setupBackground();


        /*
        var geometry = new THREE.BufferGeometry();
        var point_material = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: true,
            uniforms: {
                diffuse: {
                    value: new THREE.Color("aqua")
                },
                size: {
                    value: 0.01
                },
                scale: {
                    value: window.innerHeight / 2.0
                }
            },
            vertexShader: pointShader[0],
            fragmentShader: pointShader[1]
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 3)); //TODO gl.DYNAMIC_DRAW add
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 3));

        for (var i = 0; i < geometry.attributes.position.count; i++) {
            var point = new THREE.Vector3();
            var velocity = new THREE.Vector3();
            var assigned = false;
            for(var j = 0; j < i; j++){
                if(this.target.attributes.position.getX(i) == this.target.attributes.position.getX(j) &&
                this.target.attributes.position.getY(i) == this.target.attributes.position.getY(j) &&
                this.target.attributes.position.getZ(i) == this.target.attributes.position.getZ(j)){
                    point.x = geometry.attributes.position.getX(j);
                    point.y = geometry.attributes.position.getY(j);
                    point.z = geometry.attributes.position.getZ(j);
                    
                    velocity.x = geometry.attributes.velocity.getX(j);
                    velocity.y = geometry.attributes.velocity.getY(j);
                    velocity.z = geometry.attributes.velocity.getZ(j);
                    assigned = true;
                    break;
                }
            }
            if(!assigned){
                point.x = camera.position.x + (Math.random() - 0.5);
                point.y = camera.position.y + (Math.random() - 0.5);
                point.z = camera.position.z - 1 + (Math.random() - 0.5);
                velocity.x = 0.2 * (Math.random() - 0.5);
                velocity.y = 0.2 * (Math.random() - 0.5);
                velocity.z = 0.2 * (Math.random() - 0.5);
            }

            geometry.attributes.position.setXYZ(i, point.x, point.y, point.z);
            geometry.attributes.velocity.setXYZ(i, velocity.x, velocity.y, velocity.z);
        }

        geometry.setAttribute('enabled', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1)); //enabled at != 0
        geometry.setAttribute('distance', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1));
        geometry.computeVertexNormals();

        this.gatePoints = new THREE.Points(geometry, point_material);

        var gateMaterial = new THREE.MeshNormalMaterial();

        var gateMaterial = new THREE.ShaderMaterial({
            transparent: true,
            depthTest: true,
            side: THREE.DoubleSide,
            uniforms: {
                diffuse: {
                    value: new THREE.Color("aqua")
                }
            },
            vertexShader: gateShader[0],
            fragmentShader: gateShader[1]
        });

        var gateGeometry = new THREE.BufferGeometry();
        gateGeometry.setAttribute('position', this.target.attributes.position); //TODO gl.DYNAMIC_DRAW add
        gateGeometry.setAttribute('enabled', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1)); //enabled at != 0
        gateGeometry.setAttribute('distance', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1));
        gateGeometry.computeVertexNormals();

        this.gateMesh = new THREE.Mesh(gateGeometry, gateMaterial);


        scene.add(this.gatePoints);
        scene.add(this.gateMesh);
        */
    }

    setupCore(radius, shader){
        var geometry = new THREE.DodecahedronBufferGeometry(radius, 3);
        var material = new THREE.MeshStandardMaterial( 
            {
                color: 0xf00fff,
                transparent: true,
                opacity: 1.0,
                side: THREE.BackSide
            });
        var sphere = new THREE.Mesh( geometry, material );
        scene_sp.add( sphere );
        
        return sphere;
    }

    setupArtifacts(sizeElement, numberOfArtifacts, outerBoundRegion, internalFactor1 , internalFactor2, innerBoundRegion){
        this.artifacts = new THREE.Group();
        var light = new THREE.PointLight(0xf1f9c7, 1);
        light.position.set(0, 0, 0);
        this.artifacts.add(light);

        var material = new THREE.MeshStandardMaterial( {

            color: 0xff00ff,
            metalness: 1.00,
            roughness: 0.0,
            blending:  THREE.AdditiveBlending,
            //side: THREE.BackSide,
            transparent: true,
            opacity: 0.6
            
        
            //envMap: envMap, // important -- especially for metals!
            //envMapIntensity: envMapIntensity
        
        } );
        var geometry = new THREE.OctahedronBufferGeometry(sizeElement, 3);
        geometry.scale(0.6,0.6,10);
        for(var i = 0; i <= numberOfArtifacts; ++i){

            var artifact = new THREE.Mesh( geometry, material );
            
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
            this.artifacts.add( artifact );

        }
        scene_sp.add(this.artifacts);
    }

    setupBackground(){
        var geometry = new THREE.DodecahedronBufferGeometry(20, 6);
        var material = new THREE.MeshBasicMaterial( 
            {
                color: new THREE.Color("rgb(0, 0, 10)"),
                side: THREE.BackSide
            });
        var sphere = new THREE.Mesh( geometry, material );
        scene_sp.add( sphere );
        return sphere;
    }

    updateArtifacts(){
        this.artifacts.rotateY(0.001);
        for ( var a = 1; a < this.artifacts.children.length; a ++ ) {
            this.artifacts.children[a].rotateZ(0.06 );
            //this.artifacts.children[a].scale.z += (Math.random()-0.5) * 0.02;

            var intensity = 0.001;
            this.artifacts.children[a].translateX((Math.random()-0.5) * intensity );
            this.artifacts.children[a].translateY((Math.random()-0.5) * intensity );
            this.artifacts.children[a].translateZ((Math.random()-0.5) * intensity );
            this.artifacts.children[a].lookAt(0,0,0);

        }
        //this.artifacts.children[0].intensity = Math.abs(Math.sin(this.clock.getElapsedTime()));
    }

    update() {
        this.updateArtifacts();
    }
}