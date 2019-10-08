---
particles:
    number: 10
    oddsOfGeneration: 1.0

particle:
    width: 1 
    mass : 5
    life : 25
    lifeRange : 5

    fade : 5
    color: 3

force:
    drag : 10
    jitter : 3

---

//global vars
var canvas = document.getElementById('backgroundCanvas');
var screen = {width:0, height:0};
var simu = {x:0,y:0,z:0};
var particleArray = [];
const particleType = ParticleType({{page.particle.width}},{{page.particle.color}},{{page.particle.mass}}); //one particle type for now

//init routine

function init(){
    if(!canvas){
        return;
    }
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    mainLoop();
}

function ParticleType(W, C, M) {
    this.width= W; 
    this.color= C;
    this.mass = M;
}

function Particle(X, Y, Z, N, S) {
    this.life = N;
    this.pos = new Vec(X,Y,Z);
    this.force = new Vec(0,0,0);
    this.settings = S; //intented to be particle type
}

function Vec(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}

function updateScreenSize(){
    var win = window;
    doc = document;
    docElem = doc.documentElement;
    body = doc.getElementsByTagName('body')[0];
    screen.width = win.innerWidth; // in pixels
    screen.height = win.innerHeight; // in pixels
    
    simu.x = screen.width;
    simu.y = screen.height;
    simu.z = screen.width;
    
    canvas.width = screen.width; // in pixels
    canvas.height = screen.height - {{site.footerSize}}; // in pixels
}

function physics(particle){

}

function ageCheck(particle){
    return particle.life <= 0;
}

function processParticle(){
    for (var i = 0; i < particleArray.length; i++) {
        //remove off screen ones

        //decrease life
    }
}

function generateParticles(){
    let numberToGenerate = {{page.particles.number}} - particleArray.length;
    console.log(particleArray.length);
    if (numberToGenerate > 0){
        for (var i = 0; i < numberToGenerate; i++) {
            if(true){//Math.random() <= {{page.particles.oddsOfGeneration}} ){
                var X = Math.random() * simu.x; //this needs to be !=0
                var Y = Math.random() * simu.y;
                var Z = Math.random() * simu.z;
                var life = Math.floor(Math.random()*{{page.particle.life}}); //revisit

                particleArray.push(new Particle(X,Y,Z,life,particleType)); 
            }
        }
    }
}

function update() {

    //kill off and remove off screen ones (mnaybe a good idea to add a buffer here because of big particles so edge + biggest size)
    particleArray = particleArray.filter(ageCheck);

    //process particles
    processParticle();

    //generate new particles
    generateParticles();
}

function draw() {
    var context = canvas.getContext('2d');
    for (var i = 0; i < particleArray.length; i++) {
        context.fillStyle = "#0050F0";
        context.beginPath();
        context.arc(particleArray[i].pos.x, particleArray[i].pos.y, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

function mainLoop() {

    if (canvas.getContext) {
        update();
        draw();
    }
    window.setTimeout(mainLoop, 1000/60);

}
requestAnimationFrame(init);