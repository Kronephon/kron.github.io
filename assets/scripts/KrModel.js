class KrModel {

    constructor() {
        this.physics = new KrPhysics();
        this.target = {};
        
        this.ignoreForce = false;
        this.resourcesLoaded = false;
        

        this.particles = new THREE.Group();
        this.lines = new THREE.Group();
        this.polygons = new THREE.Group();

        SCENE.add(this.particles);
        SCENE.add(this.lines);
        SCENE.add(this.polygons);

    }

    insertParticle(part) {
        part.onBeforeRender = beforeRenderParticle;
        part.onAfterRender = afterRenderParticle;
        this.particles.add(part);
    }

    removeParticle(part) {
        
        this.particles.remove(part);
        //TODO add dispose
    }

    insertLine(line){
        this.lines.add(line);
        //target needs updating probably
    }

    removeLine(line){
        this.lines.remove(line);
        //TODO add dispose
    }

    insertPolygon(polygon){
        this.polygons.add(line);
        //target needs updating probably
    }

    removePolygon(polygon){
        this.polygons.add(line);
         //TODO add dispose
    }

    ///////////////////////////////MAIN LOGIC FUNTIONS//////////////////////////////////

    update() {
        if(!this.resourcesLoaded){
            return;
        }
        //generate new particles
        const limit = Math.min(this.target.targetsLeftToAssign(), PARTICLE_MAX_NUMBER);

        const particleNum = this.particles.children.length;
        this.generateParticles(Math.max(0,limit));
        
        //generate new lines?

        //generate new polygons?
    }

    //generates a random number of particles, maxed on number
    generateParticles(number) { 
        for (var i = 0; i < number; i++) {
            if(this.target.targetsLeftToAssign() == 0){
                break;
            }
            if (Math.random() <= GENERATION_ODDS) {
                
                const startPos = this.generateSpawnPosition();

                const particle = new KrPoint(this.generateSpawnPosition(),
                                             this.generateTargetPosition(),
                                             this.generateInitialVelocity(),
                                             new THREE.Vector3(0,0,0),
                                             PARTICLE_LIFE,
                                             PARTICLE_CHARGE);
                this.target.assignParticle(particle);
                this.insertParticle(particle);
            }
        }
    }

    generateSpawnPosition(){ //TODO: redo this
        return new THREE.Vector3(Math.random() * 500,Math.random()* 500,Math.random()* 500);
    }

    generateTargetPosition(){
        return new THREE.Vector3(0,50,0); // pointless, gets overwritten by this.target.assignParticle(part);
    }

    generateInitialVelocity(){
        return new THREE.Vector3((Math.random() - 0.5) * INIT_VELOCITY,
                                 (Math.random() - 0.5) * INIT_VELOCITY,
                                 (Math.random() - 0.5) * INIT_VELOCITY);
    }
    
    ///////////////////////////////IO////////////////////////////////////////////////////
    click() {
        this.ignoreForce = true;
    }
    declick() {
        this.ignoreForce = false;
    }

    loadComplete(){
        var target = SCENE.getObjectByName("target");
        if(typeof target === 'undefined')
            throw "target model not found";
        //target.position.set( 0, - 100, - 400 );
        //input.rotation.set( Math.PI / 2, 0, Math.PI);
        target.scale.set( 45, 45, 45 );
        target.castShadow = false;
        target.receiveShadow = true;
        target.visible = false;
        this.target = new KrTarget(target);
        setTimeout(function(){MODEL.resourcesLoaded = true;}, 1000);
    }
}

///////////////////////////////OBJECT APPENDS//////////////////////////////////////////////

function beforeRenderParticle( renderer, scene, camera, geometry, material, group ) {
    //check life here
    if(this.userData.life == 0){
        MODEL.removeParticle(this);
    }
    // compute forces
    this.setForce(0,0,0);
    this.addForce(MODEL.physics.calculateJitter(JITTER));
    this.addForce(MODEL.physics.calculateDrag(this.getVelocity(), DRAG));
    this.addForce(MODEL.physics.calculateJitter(JITTER));
    this.addForce(MODEL.physics.calculateAttraction(this.getPosition(),
                                                    this.getTarget(),
                                                    ATTRACTION,
                                                    -1, 1, true));

};

function afterRenderParticle ( renderer, scene, camera, geometry, material, group ) {
    //this.userData.life--;
    
    // apply forces
    MODEL.physics.motion(this.getForce(), this.getVelocity(), this.getPosition(), this.userData.charge);

    // check connections
    if(!this.userData.activated && this.amIonTarget(ACTIVATION_DISTANCE)){
        this.userData.activated = true;
        this.material.size = 10;
    }else if (this.userData.activated && !this.amIonTarget(ACTIVATION_DISTANCE)){
        this.userData.activated = false;
        this.material.size = DEFAULT_POINT_SIZE;
    }
    
};