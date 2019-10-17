const JITTER = 0.0005;
const DRAG = 0.025;
const ATTRACTION = 0.000025;
const REPULSION = 0;

const INITVELOCITY = 50; //4;
const FORCE_LIMIT = 30;
const PARTICLE_LIFE = 20000;
const PARTICLESIZE = 1;

const PARTICLENUMBER = 2000;
const GENERATIONODDS = 0.0005; // 0 - 1
const POSITION_THRESHOLD = 3;

const SIMUWIDTH = 300;
const SIMUHEIGHT = 200;
const SIMUDEPTH = 300;


const LINE_PROXIMITY = 3;



///////////////////////////////////////////////////////////////////

const mainMaterial =
    new THREE.MeshLambertMaterial({
        color: 0xCC0000
    });

const lineMaterial =
    new THREE.LineBasicMaterial({
        color: 0x888888
    });

///////////////////////////////////////////////////////////////////

const particleTemplate = new THREE.TetrahedronBufferGeometry(PARTICLESIZE);

///////////////////////////////////////////////////////////////////

//there needs to be a strict name adeharance to THREE.JS var names or else
//settings import will NOT work. Also userData clones are picky and cannot
//receive references.

const pointSettings = {
    name: "point",
    geometry: particleTemplate,
    material: pointMaterial,
    position: new THREE.Vector3(0, 0, 0),
    tx: 0,
    ty: 0,
    tz: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    fx: 0,
    fy: 0,
    fz: 0,
    receiveShadow: true,
    castShadow: true,
    life: PARTICLE_LIFE,
    mass: 1,
    size: PARTICLESIZE,
    inPlace: false,
};


///////////////////////////////////////////////////////////////////

class KRModel {

    //mesh.geometry.__dirtyVertices for changing vertices in buffer

    constructor() {
        // https://github.com/collinhover/threeoctree
        this.octree = new THREE.Octree({
            undeferred: true, // optional, default = false, octree will defer insertion until you call octree.update();
            depthMax: Infinity, // optional, default = Infinity, infinite depth
            objectsThreshold: 8, // optional, default = 8          //TODO what?
            overlapPct: 0.15, // optional, default = 0.15 (15%), this helps sort objects that overlap nodes
            //scene: SCENE // optional, pass scene as parameter only if you wish to visualize octree
        });

        this.particleNumber = PARTICLENUMBER;
        this.ignoreForce = false;

        this.particles = new THREE.Group();
        SCENE.add(this.particles);
        
        this.target = {};
    }

    insertParticle(part) {
        
        this.target.assignParticle(part);
        this.octree.add(part);
        this.particles.add(part);
    }

    removeParticle(part) {
        this.octree.remove(part);
        this.particles.remove(part);
        //TODO: remove
        //var targetPoint = new THREE.Vector3(part.userData.tx, part.userData.ty, part.userData.tz);
        
        //this.unassignedVertices.push(targetPoint);
        //part.dispose();
    }

    //experimental
    increasePerformance(){
        /*if(this.particleNumber < PARTICLENUMBER){
            this.particleNumber++;
            //console.loconsole.log("increasing to: " + this.particleNumber);
        }*/
    }
    decreasePerformance(){
        /*if(this.particleNumber > 0){
            this.particleNumber--;
            //console.log("decreasing to: " + this.particleNumber);
        }*/
    }

    update() {
        if((Object.entries(this.target).length === 0 && this.target.constructor === Object)){
            var object = SCENE.getObjectByName( "target", true );
            if(typeof object === 'undefined'){
                return; //wait for all loading to happen
            }
            this.initTarget(object);
        }


        for (var i = 0; i < this.particles.children.length; i++) {
            this.particleProcess(this.particles.children[i]);
            //cull
            if (this.particles.children[i].userData.life == 0) {
                this.removeParticle(this.particles.children[i]);
                continue;
            }


            this.forceCompute(this.particles.children[i]);
            this.motion(this.particles.children[i]);

        }
        this.octree.update();

        //generation
        if (this.particles.children.length <= this.particleNumber) {
            this.generateParticles(this.particleNumber - this.particles.children.length);
        }
        this.octree.rebuild();

    }
    particleProcess(particle) {
        //check for color and type differences
        var dead = particle.userData.life / PARTICLE_LIFE;

        particle.material.opacity = Math.floor(dead * 10)/10;  // TODO: migrate this
        particle.userData.life--;

        if(particle.getPosition().distanceTo(particle.getTarget()) < POSITION_THRESHOLD){
            particle.size = 7.0;
            particle.material.color.r = 0;
            particle.material.color.g = 255;
            particle.material.color.b = 0;
        }else{
            particle.size = 8;
            particle.material.color.r = 255;
            particle.material.color.g = 0;
            particle.material.color.b = 0;
        }

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
        if (this.ignoreForce) {
            particle.userData.fx = 0;
            particle.userData.fy = 0;
            particle.userData.fz = 0;
            return;
        }

        //jitter 

        var jitterDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        var jitterForce = forceDecomposer(JITTER, jitterDirection.normalize());

        particle.userData.fx = jitterForce.x;
        particle.userData.fy = jitterForce.y;
        particle.userData.fz = jitterForce.z;


        //attraction
        var target = new THREE.Vector3(particle.userData.tx,particle.userData.ty,particle.userData.tz);
        var attraction = forceInteraction(particle.position, target , 1, 1, true, ATTRACTION,true);

        particle.userData.fx += attraction.x;
        particle.userData.fy += attraction.y;
        particle.userData.fz += attraction.z;

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
        //drag

        var velocity = new THREE.Vector3(particle.userData.vx, particle.userData.vy, particle.userData.vz);
        var dragIntensity = 0.5 * DRAG * Math.pow(velocity.length(), 2);
        var dragForce = forceDecomposer(dragIntensity, velocity.multiplyScalar(-1).normalize());
        particle.userData.fx += dragForce.x;
        particle.userData.fy += dragForce.y;
        particle.userData.fz += dragForce.z;

        //apply limit

        if (particle.userData.fx > FORCE_LIMIT) {
            particle.userData.fx = FORCE_LIMIT;
        }
        if (particle.userData.fx < -FORCE_LIMIT) {
            particle.userData.fx = -FORCE_LIMIT;
        }

        if (particle.userData.fy > FORCE_LIMIT) {
            particle.userData.fy = FORCE_LIMIT;
        }
        if (particle.userData.fy < -FORCE_LIMIT) {
            particle.userData.fy = -FORCE_LIMIT;
        }

        if (particle.userData.fz > FORCE_LIMIT) {
            particle.userData.fz = FORCE_LIMIT;
        }
        if (particle.userData.fz < -FORCE_LIMIT) {
            particle.userData.fz = -FORCE_LIMIT;
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

        return new THREE.Vector3((Math.random() - 0.5) * SIMUWIDTH, (Math.random() - 0.5) * SIMUHEIGHT, (Math.random() - 0.5) * SIMUDEPTH);
    }
    initTarget(input){
        input.position.set( 0, - 100, - 400 );
        //input.rotation.set( Math.PI / 2, 0, Math.PI);
        input.scale.set( 45, 45, 45 );
        input.castShadow = false;
        input.receiveShadow = true;
        input.visible = false;

        this.target = new KRTarget(input);
    }

    generateParticles(number) {
        for (var i = 0; i < number; i++) {
            if(this.target.targetsLeftToAssign() == 0){
                break;
            }
            if (Math.random() <= GENERATIONODDS) {

                var particle = new PointParticle(pointSettings);
                const startPos = this.generateSpawnPosition();
                particle.setPosition(startPos);
                particle.setVelocity(new THREE.Vector3((Math.random() - 0.5) * INITVELOCITY, (Math.random() - 0.5) * INITVELOCITY, (Math.random() - 0.5) * INITVELOCITY));
                this.insertParticle(particle);
            }
        }
    }

    click() {
        this.ignoreForce = true;
    }
    declick() {
        this.ignoreForce = false;
    }

}



///////////////////////////////////////////////////////////////////

//break force apart, direction must be ~1
function forceDecomposer(intensity, direction) {
    return direction.setLength(intensity);
}

//calculates repulsion/attraction between particles, porportional to the sqr of their distance
function forceInteraction(position1, position2, particleSpec1, particleSpec2, attract, constant, distancePorporcional) {
    var distance = position1.distanceTo(position2);
    if (distance == 0) {
        alert("oh no");
        return forceDecomposer(0, new THREE.Vector3(0, 0, 1)); //undefined case, particles can't ocupy the same space at the same time
    }
    var forceIntensity;
    if(distancePorporcional){
        forceIntensity = constant * particleSpec1 * particleSpec2 * Math.pow(distance, 2);
    }else{
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

}

///////////////////////////////////////////////////////////////////
