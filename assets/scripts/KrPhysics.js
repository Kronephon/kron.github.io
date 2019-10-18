class KrPhysics {
    constructor() {

    }

    // different charges attract
    calculateAttraction(position, target, attraction, charge1, charge2, proportionalToDistance){ 
        

        var sqrDistance = position.distanceToSquared(target);
        if (sqrDistance == 0) {
            console.log("KrPhysics particle superposition detected");
            return forceDecomposer(Math.random(), new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)); //undefined case, particles can't ocupy the same space at the same time
        }
        var forceIntensity; 
        if(proportionalToDistance){
            forceIntensity = attraction * charge1 * charge2 * sqrDistance;
        }else{
            forceIntensity = attraction * charge1 * charge2 * 1/sqrDistance;
        }
        var newForce = new THREE.Vector3();
        newForce.copy(position);
        newForce.sub(target);
        return this.forceDecomposer(forceIntensity, newForce);
    }

    calculateDrag(velocity, drag) {
        var dragIntensity = 0.5 * drag * Math.pow(velocity.length(), 2);
        var newForce = new THREE.Vector3();
        newForce.copy(velocity);
        newForce.multiplyScalar(-1);
        return this.forceDecomposer(dragIntensity, newForce);
    }

    calculateJitter(jitter) {
        var jitterIntensity = (Math.random() - 0.5) * jitter;
        var jitterDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        return this.forceDecomposer(jitterIntensity, jitterDirection);
    }

    //changes the position and velocity with the application of the force 
    motion(force, velocity, position, mass) {

        if(mass == 0){
            throw "KRPhysics mass can't be 0";
        }
        var accel = new THREE.Vector3();

        accel.copy(force);
        accel.multiplyScalar(1 / mass);

        velocity.add(accel);

        position.add(velocity);
    }
    
    //break force apart, direction is to be normalized
    forceDecomposer(intensity, direction) {
        direction = direction.normalize();
        return direction.setLength(intensity);
    }


}
