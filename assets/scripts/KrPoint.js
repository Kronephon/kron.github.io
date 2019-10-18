const pointMaterial =
    new THREE.PointsMaterial({
        color: 0xFFFFFF,
        opacity: 0.0,
        transparent: true,
        size: PARTICLE_SIZE
});

//mesh.geometry.__dirtyVertices for changing vertices in buffer

class KrPoint extends THREE.Points{ //TODO aparently these still draw outside the screen!
    constructor(position, target, velocity, force, life, charge){
        
        var positionArray = new Float32Array( 3 );
        positionArray[ 0 ] = 0;
        positionArray[ 1 ] = 0;
        positionArray[ 2 ] = 0;

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionArray, 3 ) );
        var material = pointMaterial.clone();
        
        super(geometry, material);
        this.receiveShadow = true;
        this.castShadow = true;
        this.name = "KrPoint";

        this.userData.life = life;
        this.userData.charge = charge;
        this.setPosition(position.x, position.y, position.z);
        this.userData.target = new THREE.Vector3().copy(target);
        this.userData.velocity = new THREE.Vector3().copy(velocity);
        this.userData.force = new THREE.Vector3().copy(force);

        this.userData.activated = false;
        this.userData.connectedLines = [];
        this.userData.connectedPolygons = [];

    }

    setPosition(x,y,z){
        this.position.setX(x);
        this.position.setY(y);
        this.position.setZ(z);
        this.updateMatrixWorld();
    }
    getPosition(){
        return this.position; //read-only which is what we want;
    }

    setTarget(x, y, z){
        this.userData.target.setX(x);
        this.userData.target.setY(y);
        this.userData.target.setZ(z);
    }
    getTarget(){
        return this.userData.target;
    }
    
    setVelocity(x, y, z){
        this.userData.velocity.setX(x);
        this.userData.velocity.setY(y);
        this.userData.velocity.setZ(z);
    }
    getVelocity(){
        return this.userData.velocity;
    }

    setForce(x, y, z){
        this.userData.force.setX(x);
        this.userData.force.setY(y);
        this.userData.force.setZ(z);
    }
    addForce(vector){
        this.userData.force.add(vector);
    }
    getForce(){
        return this.userData.force;
    }
    
    connectedParticleQuery(particle){
        //should return bool
    }

    amIonTarget(distance){
        return this.position.distanceTo(this.userData.target) < distance;
    }

}
