class krParticleSystem {
    constructor(polygonalVertexShader, polygonalFragmentShader, target, scene) {
        this.spawnChance = 0.0008; //per frame new particles
        this.forceConstant = 10.0;
        this.clock = new THREE.Clock();

        var geometry = new THREE.BufferGeometry();
        var point_material = new THREE.PointsMaterial({
            size: 0.001,
            color: { value: new THREE.Color(0xffff00) }
        });

        var material = new THREE.MeshNormalMaterial({});

        if (target == undefined) {
            this.target = new THREE.IcosahedronBufferGeometry(1, 0);
        } else {
            this.target = target;
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 3)); //TODO gl.DYNAMIC_DRAW add
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 3));
        geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(this.target.attributes.position.count * 3, 1));

        for (var i = 0; i < geometry.attributes.position.count; i++) {
            var point = new THREE.Vector3();
            var velocity = new THREE.Vector3();
            point.x = camera_sp.position.x + (Math.random() - 0.5);
            point.y = camera_sp.position.y + (Math.random() - 0.5);
            point.z = camera_sp.position.z - 1 + (Math.random() - 0.5);
            velocity.x = 2.8 * (Math.random() - 0.5);
            velocity.y = 2.8 * (Math.random() - 0.5);
            velocity.z = 2.8 * (Math.random() - 0.5);
            geometry.attributes.position.setXYZ(i, point.x, point.y, point.z);
            geometry.attributes.velocity.setXYZ(i, velocity.x, velocity.y, velocity.z);
        }

        geometry.setAttribute('enabled', new THREE.Float32BufferAttribute(this.target.attributes.position.count, 1)); //enabled at 1
        geometry.computeVertexNormals();

        this.gateMesh = new THREE.Points(geometry, point_material);
        this.gateMesh2 = new THREE.Mesh(this.target, material);
        scene.add(this.gateMesh);
        //scene.add(this.gateMesh2);
    }

    updatePositions() {
        for (var i = 0; i < this.gateMesh.geometry.attributes.position.count; i++) {
            if (this.gateMesh.geometry.attributes.enabled.getX(i) == 0) {
                if (Math.random() <= this.spawnChance) {
                    this.gateMesh.geometry.attributes.enabled.setX(i, 1);
                } else {
                    continue;
                }
            }
            var point = new THREE.Vector3(this.gateMesh.geometry.attributes.position.getX(i),
                this.gateMesh.geometry.attributes.position.getY(i),
                this.gateMesh.geometry.attributes.position.getZ(i));

            var velocity = new THREE.Vector3(this.gateMesh.geometry.attributes.velocity.getX(i),
                this.gateMesh.geometry.attributes.velocity.getY(i),
                this.gateMesh.geometry.attributes.velocity.getZ(i));

            var target = new THREE.Vector3(this.target.attributes.position.getX(i),
                this.target.attributes.position.getY(i),
                this.target.attributes.position.getZ(i));

            this.applyForce(point, target, velocity);
            this.gateMesh.geometry.attributes.position.setXYZ(i, point.x, point.y, point.z);
            this.gateMesh.geometry.attributes.velocity.setXYZ(i, velocity.x, velocity.y, velocity.z);
        }
        this.gateMesh.geometry.attributes.velocity.needsUpdate = true;
        this.gateMesh.geometry.attributes.position.needsUpdate = true;
        this.gateMesh.geometry.computeVertexNormals();
        if (this.spawnChance < 1.0) {
            this.spawnChance += this.spawnChance / 10;
        }
    }

    applyForce(pointBefore, target, velocity) { // each frame is t = 1
        var distance = pointBefore.distanceTo(target);
        var initVelocity = velocity.clone();

        var attrictionValue = -0.2 * initVelocity.length();
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
        acceleration = acceleration.clampLength(-0.1, 0.1);

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



        //console.log(pointBefore);
        //throw("adw");

        //pointBefore.x += 0.01 * (Math.random() - 0.5);
        //pointBefore.y += 0.01 * (Math.random() - 0.5);
        //pointBefore.z += 0.01 * (Math.random() - 0.5);
    }

    update() {
        this.target.rotateX(Math.random() * 0.05);
        this.target.rotateY(Math.random() * 0.05);
        this.target.rotateZ(Math.random() * 0.05);
        this.target.attributes.position.needsUpdate = true;
        this.updatePositions();
    }
}