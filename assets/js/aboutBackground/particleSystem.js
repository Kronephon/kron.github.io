
class krParticleSystem{
    constructor(polygonalVertexShader, polygonalFragmentShader, target, scene) {
        this.spawnChance = 0.8; //per frame new particles
        this.clock = new THREE.Clock();

        var geometry = new THREE.IcosahedronBufferGeometry(1,0);
        var material = new THREE.MeshNormalMaterial({
        });
        this.pointMesh = new THREE.Points(geometry, material);
        console.log(this.mesh);

        if(target == undefined){
            this.target = new THREE.IcosahedronBufferGeometry(1, 0);
        }else{
            this.target = target;
        }

        console.log(this.target);
        geometry.setAttribute( 'position',  new krFloat32BufferAttribute(this.target.attributes.position.array, this.target.attributes.position.dimensions));
        //
		//geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) ); //or visible?

        console.log(this.pointMesh);
        scene.add(this.pointMesh);
    }
    pickNewParticle(){
        if(this.target.attributes.position.count != 0){
            var particleIndex = Math.random() * this.target.attributes.position.count;
            //this.geometry.setAttribute( 'position',  this.geometry.attributes.position.push(new THREE.Vector3(0,0,0)));
        }
    }
    update(){
        this.pickNewParticle();

    }
}

class krFloat32BufferAttribute extends THREE.Float32BufferAttribute{
    constructor(array, dimensions){
        super(array, dimensions);
        
        this.index = []; // each index in array will be here aswell. Also their unique content.
        for(var i = 0; i < this.count; i++){
            var point = [this.getX(i), this.getY(i), this.getZ(i)]; //this needs to be more flexible maybe
            for(var j = 0; j < this.index.length; j++){

            }
        }

        

    }
    //updated index of common points
    //automatic propagation of changes

}

