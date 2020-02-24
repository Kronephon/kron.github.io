
class titania_sp {
    constructor(vertexShader, fragmentShader, scene) {

        this.mass = 100.0;
        this.graviticConstant = 5.0;
        this.epsilon = 0.00001;           //minimal distortion
        this.simulationRadialStep = Math.PI * 2 / 5; //rad, big one TODO pick divisible steps
        this.simulationRadialDirectionStep = Math.PI * 2 / 5; //rad, direction steps
        this.lightspeed = 2000.0;
        this.photonMass = 0.00001;
        this.epsilonTime = 0.01; //time for simplicity sake (TODO change?)
        this.maximumNumberOfStep = 8000;
        this.computerFragmentShader = fragmentShader;
        this.computeTrajectories();
        
        this.clock = new THREE.Clock();
        var outerdimensions = camera_sp.position.z * 2.0;
        console.log(outerdimensions);
        this.geometry = new THREE.PlaneBufferGeometry((1.0, 1.0, 1, 1));
        this.uniforms = {
            time: { type: 'float', value: 2.0 },
            random: {type: 'float', value: Math.random()},

            minX: { type: 'float', value: -1 * this.radius }, //TODO convert radial
            minY: { type: 'float', value: -1 * this.radius },
            minZ: { type: 'float', value: -1 * this.radius },
            maxX: { type: 'float', value: this.radius },
            maxY: { type: 'float', value: this.radius },
            maxZ: { type: 'float', value: this.radius },

            radius: { type: 'float', value: 1.0 },

            starColor: { type: 'vec3', value: new THREE.Vector3(0.9, 0.7, 0.9) },

            starEdgeColor: { type: 'vec3', value: new THREE.Vector3(0.2, 0.6, 1.0) },

            starEmission: { type: 'vec3', value: new THREE.Vector3(0.8, 0.6, 1.0) },

            starRotationSpeed: { type: 'float', value: 0.4 },

            meshPosition: { type: 'vec4', value: new THREE.Vector3(0, 0, 0) }
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: this.computerFragmentShader,
            vertexShader: vertexShader,
            transparent: true,
            side: THREE.DoubleSide
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.setMeshOnCamera();
        console.log(this.mesh);
        scene.add(this.mesh);
    }
    setMeshOnCamera(){ //TODO
        this.mesh.position.x = camera_sp.position.x;
        this.mesh.position.y = camera_sp.position.y;
        this.mesh.position.z = camera_sp.position.z - 2.0;
        this.mesh.rotation.x = camera_sp.rotation.x;
        this.mesh.rotation.y = camera_sp.rotation.y;
        this.mesh.rotation.z = camera_sp.rotation.z;

    }
    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
        this.uniforms.random.value = Math.random();
        this.uniforms.center = this.mesh.position; // todo add random to emission color
    }
    computeTrajectories(){   // f = mM/d^2, assumes 0,0 as enter of force
        this.radius = Math.sqrt(this.graviticConstant * this.mass * this.photonMass / this.epsilon);
        this.trajectories = [];
        console.log(this.radius);
        for(var incomingAngle = 0; incomingAngle < Math.PI * 2; incomingAngle += this.simulationRadialStep ){

            var initialPositionX = Math.sin(incomingAngle) * this.radius;
            var initialPositionY = Math.cos(incomingAngle) * this.radius;

            for(var incomingAngleVelocity = 0; incomingAngleVelocity < Math.PI * 2; incomingAngleVelocity += this.simulationRadialDirectionStep ){            

                var initialVelocityX = Math.sin(incomingAngle) * this.lightspeed + initialPositionX; // minus maybe?
                var initialVelocityY = Math.cos(incomingAngle) * this.lightspeed + initialPositionY; // minus maybe?

                var position =  new THREE.Vector2(initialPositionX, initialPositionY);
                var velocity =  new THREE.Vector2(initialVelocityX, initialVelocityY); 

                var trajectory = [];
                trajectory.push([position.x, position.y], [velocity.x, velocity.y]);

                for(var step = 0; step < this.maximumNumberOfStep; step++){
                    //TODO check if exited or exiting
                    
                    var distanceSquared = position.length() * position.length();

                    var radialForce = this.photonMass * this.mass * this.graviticConstant / distanceSquared; //radial vector

                    // assumes that for epsilon the force is constant

                    var forceX = Math.sin(position.angle()) * radialForce;
                    var forceY = Math.cos(position.angle()) * radialForce;

                    var force = new THREE.Vector2(forceX, forceY);

                    var acceleration = force.divideScalar(this.photonMass);

                    var shiftX = velocity.x  * this.epsilonTime + 0.5 * acceleration.x * this.epsilonTime; //TODO, add sampling 
                    var shiftY = velocity.y  * this.epsilonTime + 0.5 * acceleration.y * this.epsilonTime;

                    position.x += shiftX;
                    position.y += shiftY;
                    
                    velocity.x = shiftX / this.epsilonTime;
                    velocity.y = shiftY / this.epsilonTime;
                    
                    trajectory.push([position.x, position.y], [velocity.x, velocity.y]);
                }
                this.trajectories.push([incomingAngle, incomingAngleVelocity , trajectory.copyWithin(trajectory)]);
            }
            break;
        }
        console.log(this.trajectories);
    }
    
}