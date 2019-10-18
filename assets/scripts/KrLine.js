const lineMaterial =
    new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        opacity: 0.05,
        transparent: true,
    });

class KrLine extends THREE.Line{
    constructor(particle1, particle2){
        var positionArray = new Float32Array( 6 );
        positionArray[ 0 ] = 0;
        positionArray[ 1 ] = 0;
        positionArray[ 2 ] = 0;

        positionArray[ 3 ] = 0;
        positionArray[ 4 ] = 0;
        positionArray[ 5 ] = 1;

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
        this.visible = true;
    }
    turnOFF(){
        this.visible = false;
    }
    updatePosition(){
        this.userData.particleA
        this.userData.particleB
    }
}