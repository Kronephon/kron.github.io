class krParticleSystem {
    constructor(polygonalVertexShader, polygonalFragmentShader, target, scene) {
        this.spawnChance = 0.0008; //per frame new particles
        this.forceConstant = 10.0;
        this.eccentricity = 1.0;
        this.clock = new THREE.Clock();
        this.clock.start();

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
            vertexShader: `
                    
              uniform float scale;
              uniform float size;

              attribute float enabled;
              attribute float distance;
              
              varying float vOpacity;
              varying float vDistance;
              
              void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
                gl_Position = projectionMatrix * mvPosition;
                vOpacity = enabled;
                vDistance = distance;
              }
          `,
            fragmentShader: `
              uniform vec3 diffuse;

              varying float vOpacity;
              varying float vDistance;
        
              void main() {
                if(vDistance > 0.2){
                    gl_FragColor = vec4( diffuse, vOpacity  );
                }else{
                    if(vDistance < 0.05){
                        discard;
                    }
                    gl_FragColor = vec4( diffuse, vDistance  );
                }
              }
          `
        });

        if (target == undefined) {
            this.target = new THREE.IcosahedronBufferGeometry(1, 0);
        } else {
            this.target = target;
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 3)); //TODO gl.DYNAMIC_DRAW add
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 3));

        for (var i = 0; i < geometry.attributes.position.count; i++) {
            var point = new THREE.Vector3();
            var velocity = new THREE.Vector3();
            point.x = camera_sp.position.x + (Math.random() - 0.5);
            point.y = camera_sp.position.y + (Math.random() - 0.5);
            point.z = camera_sp.position.z - 1 + (Math.random() - 0.5);
            velocity.x = 0.2 * (Math.random() - 0.5);
            velocity.y = 0.2 * (Math.random() - 0.5);
            velocity.z = 0.2 * (Math.random() - 0.5);
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
            vertexShader: `
              attribute float enabled;
              attribute float distance;
              
              varying float vEnabled;
              varying float vDistance;
              
              void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;
                vEnabled = enabled;
                vDistance = distance;
              }
          `,
            fragmentShader: `
              uniform vec3 diffuse;

              varying float vEnabled;
              varying float vDistance;
        
              void main() {
                gl_FragColor = vec4( diffuse, 0.0);
                if(vDistance < 0.8){
                    gl_FragColor = vec4( diffuse, 1.0 - abs(vDistance));
                }
              }
          `
        });

        var gateGeometry = new THREE.BufferGeometry();
        gateGeometry.setAttribute('position', this.target.attributes.position); //TODO gl.DYNAMIC_DRAW add
        gateGeometry.setAttribute('enabled', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1)); //enabled at != 0
        gateGeometry.setAttribute('distance', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1));
        gateGeometry.computeVertexNormals();

        this.gateMesh = new THREE.Mesh(gateGeometry, gateMaterial);


        scene.add(this.gatePoints);
        scene.add(this.gateMesh);
    }

    updatePositions() {
        for (var i = 0; i < this.gatePoints.geometry.attributes.position.count; i++) {
            var point = new THREE.Vector3(this.gatePoints.geometry.attributes.position.getX(i),
                this.gatePoints.geometry.attributes.position.getY(i),
                this.gatePoints.geometry.attributes.position.getZ(i));

            var velocity = new THREE.Vector3(this.gatePoints.geometry.attributes.velocity.getX(i),
                this.gatePoints.geometry.attributes.velocity.getY(i),
                this.gatePoints.geometry.attributes.velocity.getZ(i));

            var target = new THREE.Vector3(this.target.attributes.position.getX(i),
                this.target.attributes.position.getY(i),
                this.target.attributes.position.getZ(i));

            if (this.gatePoints.geometry.attributes.enabled.getX(i) == 0) {
                if (Math.random() <= this.spawnChance) {
                    this.gatePoints.geometry.attributes.enabled.setX(i, 1.0);
                    this.gateMesh.geometry.attributes.enabled.setX(i, 1.0);
                    this.gatePoints.geometry.attributes.enabled.needsUpdate = true;
                    this.gateMesh.geometry.attributes.enabled.needsUpdate = true;
                }
            } else {
                this.applyForce(point, target, velocity);
            }
            this.gatePoints.geometry.attributes.position.setXYZ(i, point.x, point.y, point.z);
            this.gatePoints.geometry.attributes.velocity.setXYZ(i, velocity.x, velocity.y, velocity.z);
            this.gatePoints.geometry.attributes.distance.setX(i, point.distanceTo(target));
            this.gateMesh.geometry.attributes.distance.setX(i, point.distanceTo(target));
        }
        this.gatePoints.geometry.attributes.velocity.needsUpdate = true;
        this.gatePoints.geometry.attributes.position.needsUpdate = true;
        this.gatePoints.geometry.attributes.distance.needsUpdate = true;
        this.gateMesh.geometry.attributes.distance.needsUpdate = true;

        this.gatePoints.geometry.computeVertexNormals();
        this.gateMesh.geometry.computeVertexNormals();

        //console.log(this.gateMesh.geometry.attributes.distance);
        //throw ("dawonj");

        if (this.spawnChance < 1.0) {
            this.spawnChance += this.spawnChance / 100;
        }
    }

    applyForce(pointBefore, target, velocity) { // each frame is t = 1
        var distance = pointBefore.distanceTo(target);
        var initVelocity = velocity.clone();

        var attrictionValue = -0.1 * initVelocity.length();
        var attriction = new THREE.Vector3();
        attriction = initVelocity.clone().normalize();
        attriction = attriction.multiplyScalar(attrictionValue);

        var accelerationValue = 0;
        if (distance != 0) {
            accelerationValue = -this.forceConstant / (distance * distance);
        }
        var acceleration = new THREE.Vector3();
        acceleration = acceleration.subVectors(pointBefore, target).normalize();
        acceleration = acceleration.multiplyScalar(accelerationValue);
        acceleration = acceleration.clampLength(-0.01, 0.01);

        var newPosition = new THREE.Vector3();
        newPosition.x = pointBefore.x + initVelocity.x + (acceleration.x + attriction.x) * 0.5;
        newPosition.y = pointBefore.y + initVelocity.y + (acceleration.y + attriction.y) * 0.5;
        newPosition.z = pointBefore.z + initVelocity.z + (acceleration.z + attriction.z) * 0.5;

        //console.log(newPosition);
        //console.log(pointBefore);

        velocity.x = newPosition.x - pointBefore.x;
        velocity.y = newPosition.y - pointBefore.y;
        velocity.z = newPosition.z - pointBefore.z;

        //console.log(pointBefore);
        pointBefore.x = newPosition.x;
        pointBefore.y = newPosition.y;
        pointBefore.z = newPosition.z;
    }

    update() {
        this.target.rotateX((Math.random() - 0.6) * 0.001);
        this.target.rotateY((Math.random() - 0.25) * 0.002);
        this.target.rotateZ((Math.random() - 0.2) * 0.005);
        this.target.rotateY(0.06 * Math.abs(Math.sin((1 * this.clock.getElapsedTime()))));
        this.target.rotateZ(0.025 * Math.abs(Math.cos((0.7 * this.clock.getElapsedTime()))));

        this.updatePositions();
    }
}