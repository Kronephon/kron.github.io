const lineMaterial =
    new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        opacity: 0.05,
        transparent: true,
    });

class Wireframe extends THREE.Line{
    constructor(particle1, particle2){
        
        var geometry = new THREE.Geometry();
        geometry.vertices.push(particle1.getPosition());
        geometry.vertices.push(particle2.getPosition()); 
        super(geometry, lineMaterial);

        this.userData.particleA = particle1;
        this.userData.particleB = particle2;

        particle1.userData.connectedLines.push(this);
        particle2.userData.connectedLines.push(this);

    }
    process(){
        //this.geometry.vertices[0] = this.userData.particleA.getPosition();
        //this.geometry.vertices[1] = this.userData.particleB.getPosition(); // this can be replaced with a event call...
        //this.geometry.verticesNeedUpdate = true;
    }
}