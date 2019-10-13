const JITTER = 0.002;
const DRAG = 0.06;

const PARTICLENUMBER = 3000;
const GENERATIONODDS = 0.01;    // 0 - 1

const PARTICLESIZE = 1;

const SIMUWIDTH = 300;
const SIMUHEIGHT = 200;
const SIMUDEPTH = 300;



///////////////////////////////////////////////////////////////////

const mainMaterial =
  new THREE.MeshLambertMaterial({
    color: 0xCC0000
});


//there needs to be a strict name adeharance to THREE.JS var names or else
//settings import will NOT work
const pointSettings = {
    name: "point",
    geometry: new THREE.TetrahedronBufferGeometry(PARTICLESIZE),
    //material: mainMaterial, TODO add proper sprite here
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    force: new THREE.Vector3(0, 0, 0), //maybe forces should be punctual?
    receiveShadow: true,
    castShadow: true,
    color: 0xFFFFFF,
    life: 60,
    size: PARTICLESIZE
};


const tetraSettings = {
    name: "tetra",
    geometry: new THREE.TetrahedronBufferGeometry(PARTICLESIZE),
    material: mainMaterial,
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    force: new THREE.Vector3(0, 0, 0), //maybe forces should be punctual?
    receiveShadow: true,
    castShadow: true,
    color: 0xFFFFFF,
    life: 60,
    size: PARTICLESIZE
};

///////////////////////////////////////////////////////////////////

class KRModel{

    constructor(){
        // https://github.com/collinhover/threeoctree
        this.octree = new THREE.Octree({
            undeferred: true, // optional, default = false, octree will defer insertion until you call octree.update();
            depthMax: Infinity, // optional, default = Infinity, infinite depth
            objectsThreshold: 900, // optional, default = 8          //TODO what?
            overlapPct: 0.15, // optional, default = 0.15 (15%), this helps sort objects that overlap nodes
            scene: SCENE // optional, pass scene as parameter only if you wish to visualize octree
        } );

        this.particles = new THREE.Group();
        SCENE.add(this.particles);
        console.log(this.particles.size);
    }

    insertParticle(part){
        this.octree.add(part);
        this.particles.add(part);
    }

    removeParticle(part){

    }

    update(){
        //var object = scene.getObjectbyName( "objectName" );


        //cull

        //force
        //(this.octree.search(new THREE.Vector3(0,0,0), 3000 )).forEach(function(element) {
        //    element.object.process();
        //});
        
        //generation
        if(this.particles.children.length < PARTICLENUMBER){
            this.generateParticles(PARTICLENUMBER - this.particles.children.length);
        }
    }

    generateSpawnPosition(){ //TODO add frustum here
        /*
        if(CAMERA.isPerspectiveCamera){

            var near = CAMERA.near;
            var far = CAMERA.far;
            frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );

            CAMERA.updateMatrix(); 
            CAMERA.updateMatrixWorld();  // TODO is this needed?

            var frustum = new THREE.Frustum();
            var projScreenMatrix = new THREE.Matrix4();
            projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );


            CAMERA.view.containsPoint(0,0,0);
        }
        //TODO only works with perspective cameras for now

         */

        return [(Math.random() -0.5 )* SIMUWIDTH, (Math.random() -0.5 ) * SIMUHEIGHT, (Math.random() -0.5 ) * SIMUDEPTH];
    }

    generateParticles(number){
        for(var i = 0; i < number; i++){
            if(Math.random() <= GENERATIONODDS){
                var particle = new KRParticle();
                particle.loadSettings(pointSettings);
                const startPos = this.generateSpawnPosition();
                particle.position.x = startPos[0];
                particle.position.y = startPos[1];
                particle.position.z = startPos[2];
                this.insertParticle(particle);
            }
        }
    }

}