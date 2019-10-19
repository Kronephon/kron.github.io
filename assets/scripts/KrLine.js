const lineMaterial =
    new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        opacity: 0.05,
        transparent: true,
        visible: false
    });

class KrLine extends THREE.Line{
    constructor(particle1, particle2){
        var positionArray = new Float32Array( 6 );
        positionArray[ 0 ] = 0;
        positionArray[ 1 ] = 0;
        positionArray[ 2 ] = 0;

        positionArray[ 3 ] = Math.random()* 50;
        positionArray[ 4 ] = Math.random()* 50;
        positionArray[ 5 ] = Math.random()* 50;

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionArray, 3 ) ); //maybe?
        
        var material = lineMaterial.clone();
        super(geometry, material);

        this.userData.particleA = particle1;
        this.userData.particleB = particle2;

        particle1.userData.connectedLines.push(this);
        particle2.userData.connectedLines.push(this);

    }
    turnON(){
        if(this.userData.particleA.userData.activated && this.userData.particleB.userData.activated) {
            this.updatePosition();
            this.material.visible = true;
        }
    }
    turnOFF(){
        this.material.visible = false;
    }
    updatePosition(){
        this.geometry.attributes.position.array[ 0 ] = this.userData.particleA.position.x;
        this.geometry.attributes.position.array[ 1 ] = this.userData.particleA.position.y;
        this.geometry.attributes.position.array[ 2 ] = this.userData.particleA.position.z;

        this.geometry.attributes.position.array[ 3 ] = this.userData.particleB.position.x;
        this.geometry.attributes.position.array[ 4 ] = this.userData.particleB.position.y;
        this.geometry.attributes.position.array[ 5 ] = this.userData.particleB.position.z;

        this.geometry.attributes.position.needsUpdate = true;
    }
}