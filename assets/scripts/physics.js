const JITTER = 0.05;
const DRAG = 3;
const ATTRACTION = 0.05;
const REPULSION = 0;

const INITVELOCITY = 3;
const FORCE_LIMIT = 3;

class KRPhysics {
    constructor() {

    }

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
    //calculates repulsion/attraction between particles, porportional to the sqr of their distance
    /*forceInteraction(position1, position2, particleSpec1, particleSpec2, attract, constant, distancePorporcional) {
        var distance = position1.distanceTo(position2);
        if (distance == 0) {
            alert("oh no");
            return forceDecomposer(0, new THREE.Vector3(0, 0, 1)); //undefined case, particles can't ocupy the same space at the same time
        }
        var forceIntensity;
        if (distancePorporcional) {
            forceIntensity = constant * particleSpec1 * particleSpec2 * Math.pow(distance, 2);
        } else {
            forceIntensity = constant * particleSpec1 * particleSpec2 / Math.pow(distance, 2);
        }

        if (attract) {
            forceIntensity *= -1;
        }

        var distanceVect = new THREE.Vector3();
        distanceVect.x = position1.x;
        distanceVect.y = position1.y;
        distanceVect.z = position1.z;
        distanceVect.sub(position2);

        return forceDecomposer(forceIntensity, distanceVect);

    }*/



        //repulsion
        // F = (G * m1 * m2) / (d*d) > Jitter Constant let's use mass for it
        /*
        var radius = 2; //Math.sqrt(REPULSION * particle.userData.mass * particle.userData.mass / JITTER); //fair assumption though better would be biggest mass in the board
        var search = this.octree.search(particle.position, radius);
        
        for (var i = 0; i < search.length; i++) {
            if (particle.uuid == search[i].object.uuid) {
                continue;
            }
            var p1 = particle.position;
            var p2 = search[i].object.position;

            //TODO has a bug which eventually propagates through all the particles. I think it is a NaN. Add limits?
            var repulsion = forceInteraction(p1, p2, particle.userData.mass, search[i].object.userData.mass, false, REPULSION,false);

            particle.userData.fx += repulsion.x;
            particle.userData.fy += repulsion.y;
            particle.userData.fz += repulsion.z;

        }*/