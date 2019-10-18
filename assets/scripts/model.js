const PARTICLE_LIFE = 20000;
const PARTICLESIZE = 1;

const PARTICLENUMBER = 2000;
const GENERATIONODDS = 0.005; // 0 - 1
const POSITION_THRESHOLD = 5;

const SIMUWIDTH = 300;
const SIMUHEIGHT = 200;
const SIMUDEPTH = 300;





///////////////////////////////////////////////////////////////////

const mainMaterial =
    new THREE.MeshLambertMaterial({
        color: 0xCC0000
    });

///////////////////////////////////////////////////////////////////

class KRModel {

    //mesh.geometry.__dirtyVertices for changing vertices in buffer

    constructor() {
        this.physics = new KRPhysics();
        this.particleNumber = PARTICLENUMBER;
        this.ignoreForce = false;
        this.canGenerateParticles = false;

        this.particles = new THREE.Group();
        this.lines = new THREE.Group();
        SCENE.add(this.particles);
        SCENE.add(this.lines);
        
        this.target = {};
    }

    insertParticle(part) {
        
        this.target.assignParticle(part);
        this.particles.add(part);
    }

    removeParticle(part) {
        this.particles.remove(part);
        //TODO: remove
        //var targetPoint = new THREE.Vector3(part.userData.tx, part.userData.ty, part.userData.tz);
        
        //this.unassignedVertices.push(targetPoint);
        //part.dispose();
    }

    insertLine(line){
        this.lines.add(line);
        //target needs updating probably
    }

    removeLine(line){
        this.lines.remove(line);
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
        if(!this.loadedResources){
            return;
        }
        for (var i = 0; i < this.particles.children.length; i++) {
            this.cull(this.particles.children[i]);
            this.physics(this.particles.children[i]);
            this.birth();
        }

        for (var i = 0; i < this.particles.children.length; i++) {
            this.applyMotion(this.particles.children[i]);
            this.processParticle(this.particles.children[i]);
        }
    }

    particleProcess(particle) {
        //check for color and type differences
        var dead = particle.userData.life / PARTICLE_LIFE;

        particle.material.opacity = Math.floor(dead * 10)/10;  // TODO: migrate this
        particle.userData.life--;

        if(particle.getPosition().distanceTo(particle.getTarget()) < POSITION_THRESHOLD && !particle.inPlace){
            particle.userData.inPlace = true;
            this.activateParticle(particle);
        }
        if(particle.getPosition().distanceTo(particle.getTarget()) >= POSITION_THRESHOLD && particle.inPlace){
            //particle.userData.inPlace = false;
            this.deactivateParticle(particle);
        }
    }

    activateParticle(particle) {
        var connectedParticles = this.target.getConnectedParticles(particle);
        for (var i = 0; i < connectedParticles.length; i++) {
            var faceB;
            var faceC;
            if (typeof connectedParticles[i][0] !== 'undefined') {
                faceB = this.particles.getObjectByProperty("uuid", connectedParticles[i][0]);
            }
            if (typeof connectedParticles[i][1] !== 'undefined') {
                faceC = this.particles.getObjectById(connectedParticles[i][1]);

            }
            if (typeof faceB !== 'undefined' && faceB.userData.inPlace) {

                if(!particle.checkLine(faceB)){
                    this.insertLine(new Wireframe(particle, faceB));
                }
                
                
                
            }
            if (typeof faceC !== 'undefined' && faceC.userData.inPlace) {
                if(!particle.checkLine(faceC)){
                    this.insertLine(new Wireframe(particle, faceC));
                }
            }
        }
    }

    deactivateParticle(particle){

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

        this.canGenerateParticles = true;
    }

    generateParticles(number) { // important: assumes target has been initialized
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