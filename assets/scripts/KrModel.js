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

        part.setTarget(this.target.assignParticle(part));
        //line stuff
        
        const conn = this.target.getConnectedParticles(part);
        if(conn.length > 0){
            for(var i = 0; i < conn.length; i++){
                //check that it doesn't exist already
                let connectedLine = part.connectedParticleQuery(conn[i]);
                if(connectedLine == -1){
                    //add new line!
                    var line = new KrLine(part, conn[i]);
                    this.insertLine(line);
                }else{
                    
                    
                }
            }
        }


        this.particles.add(part);
    }

    removeParticle(part) {
        
        this.particles.remove(part);
        //TODO add dispose
    }

    insertLine(line){
        line.onBeforeRender = beforeRenderLine;
        line.onAfterRender = afterRenderLine;
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
    }

    activateParticle(particle){
        //make all connected lines (with matching particles) visible
        for(var i=0;i< particle.userData.connectedLines.length;i++){
            particle.userData.connectedLines[i].turnON();
        }
    }

    deactivateParticle(particle){

        //make all connected lines invisible;
        for(var i=0;i< particle.userData.connectedLines.length;i++){
            particle.userData.connectedLines[i].turnOFF();
        }

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
        target.position.set( 0, 100, 0 );
        //input.rotation.set( Math.PI / 2, 0, Math.PI);
        target.scale.set( 5, 5, 5 );
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
    if(!MODEL.ignoreForce){
        this.addForce(MODEL.physics.calculateDrag(this.getVelocity(), DRAG));
        this.addForce(MODEL.physics.calculateJitter(JITTER));
        this.addForce(MODEL.physics.calculateAttraction(this.getPosition(),
                                                        this.getTarget(),
                                                        ATTRACTION,
                                                        -1, 1, true));
    }
    if(this.userData.activated){
        this.material.size = Math.min(this.material.size + 0.25, PARTICLE_ACTIVATED_SIZE);
        this.material.opacity = Math.min(this.material.size + 0.05, PARTICLE_OPACITY_ACTIVATED);
    }else {
        this.material.size = Math.max(this.material.size - 0.25, PARTICLE_SIZE);
        this.material.opacity = Math.max(this.material.size - 0.05, PARTICLE_OPACITY);
    }
    
    

};

function afterRenderParticle ( renderer, scene, camera, geometry, material, group ) {
    //this.userData.life--;
    
    // apply forces
    MODEL.physics.motion(this.getForce(), this.getVelocity(), this.getPosition(), this.userData.charge);

    // check connections
    if(!this.userData.activated && this.amIonTarget(ACTIVATION_DISTANCE)){
        this.userData.activated = true;
        //this.material.size = PARTICLE_ACTIVATED_SIZE;
        MODEL.activateParticle(this);
    }else if (this.userData.activated && !this.amIonTarget(ACTIVATION_DISTANCE)){
        this.userData.activated = false;
        //this.material.size = PARTICLE_SIZE;
        MODEL.deactivateParticle(this);
    }
    
};

function beforeRenderLine( renderer, scene, camera, geometry, material, group ) {
    if(this.material.visible){
        this.updatePosition();
        this.material.opacity  = Math.min(this.material.opacity + 0.01, LINE_OPACITY_ACTIVATED);
    }else{
        this.material.opacity  = Math.max(this.material.opacity - 0.01, LINE_OPACITY);
    }
    
}


function afterRenderLine( renderer, scene, camera, geometry, material, group ) {
}