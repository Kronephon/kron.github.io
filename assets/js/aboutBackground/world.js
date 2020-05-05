class KrWorld {
    constructor(gateShader) {
        
        this.clock = new THREE.Clock();
        this.clock.start();

        this.sphere1 = this.setupCore(1.0, gateShader);

        this.setupArtifacts(0.03);
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
        var geometry = new THREE.DodecahedronBufferGeometry(radius, 6);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphere = new THREE.Mesh( geometry, material );
        scene_sp.add( sphere );
        return sphere;
    }

    setupArtifacts(){
        /*const base = new THREE.OctahedronBufferGeometry(0.03);
        var geometry = new THREE.InstancedBufferGeometry();
        geometry.maxInstancedCount = 50000;
        var positions = [];
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
        var mesh = new THREE.Mesh( geometry, material );
        scene_sp.add( mesh );*/
    }

    update() {

    }
}