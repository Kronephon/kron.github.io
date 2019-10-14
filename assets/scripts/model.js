const JITTER = 0.005;
const DRAG = 0.05;
const ATTRACTION = 0.01;
const REPULSION = 0.01;
const INITVELOCITY = 3;

const PARTICLENUMBER = 50;
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

const pointMaterial =
    new THREE.PointsMaterial({ color: 0x888888 });


//there needs to be a strict name adeharance to THREE.JS var names or else
//settings import will NOT work. Also userData clones are picky and cannot
//receive references.

const pointSettings = {
    name: "point",
    geometry: new THREE.TetrahedronBufferGeometry(PARTICLESIZE),
    material: pointMaterial, 
    position: new THREE.Vector3(0, 0, 0),
    vx: 0,
    vy: 0,
    vz: 0,
    fx: 0,
    fy: 0,
    fz: 0,
    receiveShadow: true,
    castShadow: true,
    color: 0xFFFFFF,
    life: 60,
    mass: 1,
    size: PARTICLESIZE
};


const tetraSettings = {
    name: "tetra",
    geometry: new THREE.TetrahedronBufferGeometry(PARTICLESIZE),
    material: mainMaterial,
    position: new THREE.Vector3(0, 0, 0),
    vx: new THREE.Vector3(0, 0, 0),
    force: new THREE.Vector3(0, 0, 0), //maybe forces should be punctual?
    receiveShadow: true,
    castShadow: true,
    color: 0xFFFFFF,
    life: 60,
    mass: 2,
    size: PARTICLESIZE
};

///////////////////////////////////////////////////////////////////

class KRModel {

    constructor() {
        // https://github.com/collinhover/threeoctree
        this.octree = new THREE.Octree({
            undeferred: true, // optional, default = false, octree will defer insertion until you call octree.update();
            depthMax: Infinity, // optional, default = Infinity, infinite depth
            objectsThreshold: 900, // optional, default = 8          //TODO what?
            overlapPct: 0.15, // optional, default = 0.15 (15%), this helps sort objects that overlap nodes
            scene: SCENE // optional, pass scene as parameter only if you wish to visualize octree
        });

        this.particles = new THREE.Group();
        SCENE.add(this.particles);
    }

    insertParticle(part) {
        this.octree.add(part);
        this.particles.add(part);
    }

    removeParticle(part) {

    }

    update() {
        for (var i = 0; i < this.particles.children.length; i++) {
            this.forceCompute(this.particles.children[i]);
            this.motion(this.particles.children[i]);
            this.particles.children[i].process();
        }
        this.octree.update();


        //cull

        //force
        //(this.octree.search(new THREE.Vector3(0,0,0), 3000 )).forEach(function(element) {
        //    element.object.process();
        //});

        //generation
        if (this.particles.children.length < PARTICLENUMBER) {
            this.generateParticles(PARTICLENUMBER - this.particles.children.length);
        }
        this.octree.rebuild();
    }

    motion(particle) {

        if (typeof particle.userData.mass === 'undefined') {
            console.log("KRParticle process: " + particle.userData.name + " has no mass.");
            return;
        }

        const aX = particle.userData.fx / particle.userData.mass;
        const aY = particle.userData.fy / particle.userData.mass;
        const aZ = particle.userData.fz / particle.userData.mass;

        particle.userData.vx += aX;
        particle.userData.vy += aY;
        particle.userData.vz += aZ;

        particle.position.x += particle.userData.vx;
        particle.position.y += particle.userData.vy;
        particle.position.z += particle.userData.vz;
    }

    forceCompute(particle) {
        //attraction

        // let's try out attraction to center, porporcional to distance from it. This can later be changed into shape.
        particle.userData.fx = -(particle.position.x / (SIMUWIDTH / 2)) * ATTRACTION;
        particle.userData.fy = -(particle.position.y / (SIMUHEIGHT / 2)) * ATTRACTION;
        particle.userData.fz = -(particle.position.z / (SIMUDEPTH / 2)) * ATTRACTION;

        //repulsion
        // F = (G * m1 * m2) / (d*d) > Jitter Constant let's use mass for it

        var radius = 1000;// Math.sqrt(REPULSION * particle.userData.mass * particle.userData.mass  / JITTER); //fair assumption though better would be biggest mass in the board
        var search = this.octree.search( particle.position, radius ); 
        
        for(var i = 0; i < search.length; i++){
            if(particle.uuid == search[i].object.uuid){
                continue;
            }
            var p1 = particle.position;
            var p2 = search[i].object.position;
            //var distance = Math.sqrt(Math.pow(p2.x - p1.x, 2)+Math.pow(p2.y - p1.y, 2)+Math.pow(p2.z - p1.z, 2));

            var distanceX = p2.x - p1.x;
            var distanceY = p2.y - p1.y;
            var distanceZ = p2.z - p1.z;

            if(typeof distanceX === 'undefined'){
                alert("oh no");
            }
            if(typeof distanceY === 'undefined'){
                alert("oh no");
            }
            if(typeof distanceZ === 'undefined'){
                alert("oh no");
            }
            if(typeof particle.userData.mass === 'undefined'){
                alert("oh no");
            }
            if(typeof search[i].object.userData.mass === 'undefined'){
                alert("oh no");
            }

            if(distanceX != 0){
                particle.userData.fx -= (REPULSION * particle.userData.mass * search[i].object.userData.mass)/distanceX; 
            }
            if(distanceY != 0){
                particle.userData.fy -= (REPULSION * particle.userData.mass * search[i].object.userData.mass)/distanceY;
            }
            if(distanceZ != 0){
                particle.userData.fz -= (REPULSION * particle.userData.mass * search[i].object.userData.mass)/distanceZ;
            }
            if(typeof particle.userData.fz === 'undefined'){
                alert("oh no");
            }

            
            

            //throw error();

        }

        

        //jitter 
        particle.userData.fx += (Math.random() - 0.5) * JITTER;
        particle.userData.fy += (Math.random() - 0.5) * JITTER;
        particle.userData.fz += (Math.random() - 0.5) * JITTER;
        //drag

        var dragX = 0.5 * DRAG * particle.userData.vx * particle.userData.vx;
        var dragY = 0.5 * DRAG * particle.userData.vy * particle.userData.vy;
        var dragZ = 0.5 * DRAG * particle.userData.vz * particle.userData.vz;

        if (particle.userData.vx > 0) {
            particle.userData.fx -= dragX;
        } else {
            particle.userData.fx += dragX;
        }
        if (particle.userData.vy > 0) {
            particle.userData.fy -= dragY;
        } else {
            particle.userData.fy += dragY;
        }
        if (particle.userData.vz > 0) {
            particle.userData.fz -= dragZ;
        } else {
            particle.userData.fz += dragZ;
        }
    }

    generateSpawnPosition() { //TODO add frustum here
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

        return [(Math.random() - 0.5) * SIMUWIDTH, (Math.random() - 0.5) * SIMUHEIGHT, (Math.random() - 0.5) * SIMUDEPTH];
    }

    generateParticles(number) {
        for (var i = 0; i < number; i++) {
            if (Math.random() <= GENERATIONODDS) {
                var particle = new KRParticle();
                particle.loadSettings(pointSettings);
                const startPos = this.generateSpawnPosition();
                particle.userData.vx = (Math.random() - 0.5) * INITVELOCITY;
                particle.userData.vy = (Math.random() - 0.5) * INITVELOCITY;
                particle.userData.vz = (Math.random() - 0.5) * INITVELOCITY;
                particle.position.x = startPos[0];
                particle.position.y = startPos[1];
                particle.position.z = startPos[2];
                this.insertParticle(particle);
            }
        }
    }

}