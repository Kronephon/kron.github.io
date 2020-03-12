
class krParticleSystem{
    constructor(polygonalVertexShader, polygonalFragmentShader, target, scene) {
        this.spawnChance = 0.8; //per frame new particles
        this.forceConstant = 0.01;
        this.clock = new THREE.Clock();

        var geometry = new THREE.BufferGeometry();
        var material = new THREE.PointsMaterial({
            size: 0.001
        });

        if(target == undefined){
            this.target = new THREE.IcosahedronBufferGeometry(1, 0);
        }else{
            this.target = target;
        }
        geometry.setAttribute( 'position',  new THREE.Float32BufferAttribute( this.target.attributes.position.count * 3, 3)); //TODO gl.DYNAMIC_DRAW add
        geometry.setAttribute( 'velocity',  new THREE.Float32BufferAttribute( this.target.attributes.position.count * 3, 3));

        for(var i = 0; i < geometry.attributes.position.count; i++){
            var point = new THREE.Vector3(geometry.attributes.position.getX(i), 
                                          geometry.attributes.position.getY(i), 
                                          geometry.attributes.position.getZ(i));

            var velocity = new THREE.Vector3(geometry.attributes.velocity.getX(i), 
                                             geometry.attributes.velocity.getY(i), 
                                             geometry.attributes.velocity.getZ(i));      

            point.x = Math.random();
            point.y = Math.random();
            point.z = Math.random();
            velocity.x = 0.03 * Math.random();
            velocity.y = 0.03 *Math.random();
            velocity.z = 0.03 * Math.random();
            geometry.attributes.position.setXYZ(i, point.x, point.y, point.z);
            geometry.attributes.velocity.setXYZ(i, velocity.x, velocity.y, velocity.z);
        }

        geometry.setAttribute( 'enabled',   new THREE.Float32BufferAttribute( this.target.attributes.position.count, 1)); //enabled at 0
        geometry.computeVertexNormals();

        this.gateMesh = new THREE.Points(geometry, material);

        scene.add(this.gateMesh);
    }

    updatePositions(){
        for(var i = 0; i < this.gateMesh.geometry.attributes.position.count; i++){
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
    }

    applyForce(pointBefore, target, velocity){ // each frame is t = 1
        var distance = pointBefore.distanceTo(target);
        var initVelocity = velocity.clone();
        
        var accelerationValue = - this.forceConstant* (distance * distance);
        var acceleration = new THREE.Vector3();
        acceleration = acceleration.subVectors(pointBefore, target).normalize();
        acceleration = acceleration.multiplyScalar(accelerationValue);
        
        var newPosition = new THREE.Vector3();
        newPosition.x = pointBefore.x + initVelocity.x + acceleration.x * 0.5; 
        newPosition.y = pointBefore.y + initVelocity.y + acceleration.y * 0.5; 
        newPosition.z = pointBefore.z + initVelocity.z + acceleration.z * 0.5; 
        //console.log(newPosition);
        //console.log(pointBefore);

        velocity.x = newPosition.x - pointBefore.x;
        velocity.y = newPosition.y - pointBefore.y;
        velocity.z = newPosition.z - pointBefore.z;

        pointBefore.x = newPosition.x;
        pointBefore.y = newPosition.y;
        pointBefore.z = newPosition.z;

        
        
        //console.log(pointBefore);
        //throw("adw");

        //pointBefore.x += 0.01 * (Math.random() - 0.5);
        //pointBefore.y += 0.01 * (Math.random() - 0.5);
        //pointBefore.z += 0.01 * (Math.random() - 0.5);
    }

    update(){
        this.updatePositions();
    }

    getPointIndex(buffer){ // expects Float32BufferAttribute
        var tmpBuffer = buffer.clone ();
        var result = []; 
        
        for(var i = 0; i < tmpBuffer.count; i++){
            var point = [tmpBuffer.getX(i), tmpBuffer.getY(i), tmpBuffer.getZ(i)]; //this needs to be more flexible maybe
            var pointIndex = [i]; 
            tmpBuffer.setXYZ(i, 9999, 9999, 9999, 9999); 
            for(var j = 0; j < tmpBuffer.count; j++){ // point ID could just be the index mix
                var pointProbe = [tmpBuffer.getX(i), tmpBuffer.getY(i), tmpBuffer.getZ(i)];
                if(pointProbe[0] == 9999 && pointProbe[1] == 9999, pointProbe[2] == 9999){
                    continue;
                }
                if(pointProbe[0] == point[0] && pointProbe[1] == point[1], pointProbe[2] == point[2]){
                    tmpBuffer.setXYZ(j, 9999, 9999, 9999, 9999); 
                    pointIndex.push(j);
                    continue;
                }
            }
            result.push(pointIndex);
        }
        console.log(result);
    }
    applyChangetoPoint(buffer, point, newValue){

    }
}

