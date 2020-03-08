
class krParticleSystem extends THREE.Points{
    constructor(polygonalVertexShader, polygonalFragmentShader, target, scene) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.PointsMaterial({
        });
        super(geometry, material);
        if(target == undefined){
            this.userData.target = new THREE.IcosahedronBufferGeometry(1, 1);
        }else{
            this.userData.target = target;
        }

        this.userData.spawnChance = 0.8; //per frame new particles
        this.userData.particleLife = 30; //frames of assured life
        this.userData.deathChange = 0.8; //per frame death change (after particleLife)



        geometry.setAttribute( 'position', this.userData.target.attributes.position );
		//geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        console.log(this);
        scene.add(this);
    }
}

class krParticles extends THREE.Mesh{
    constructor(scene){
        var material = new THREE.PointsMaterial({
            
        })
        var geometry = new THREE.BufferGeometry();
        super(geometry, material);

        scene.add(this);
    }
}
