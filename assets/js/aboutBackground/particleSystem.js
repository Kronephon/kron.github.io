
class krParticleSystem{
    constructor(polygonalVertexShader, polygonalFragmentShader, target, scene) {
        this.spawnChance = 0.8; //per frame new particles
        this.clock = new THREE.Clock();

        var geometry = new THREE.BufferGeometry();
        var material = new THREE.MeshNormalMaterial({
        });

        if(target == undefined){
            this.target = new THREE.IcosahedronBufferGeometry(1, 0);
        }else{
            this.target = target;
        }
        geometry.setAttribute( 'position',  this.target.attributes.position); //TODO gl.DYNAMIC_DRAW add
        geometry.setAttribute( 'enabled', new THREE.Float32BufferAttribute( this.target.attributes.position.count, 1 ) ); //enabled at 0
        geometry.computeVertexNormals();

        this.gateMesh = new THREE.Mesh(geometry, material);

        scene.add(this.gateMesh);
    }
    
    pickNewParticle(){
    
    }
    update(){
        
        this.pickNewParticle();
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

