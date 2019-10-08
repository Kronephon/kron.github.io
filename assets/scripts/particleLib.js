---
main:
    framerate: 60

particles:
    number: 100
    oddsOfGeneration: 0.002

particle:
    width: 1 
    mass : 5
    life : 20000
    lifeRange : 5

    fade : 5
    color: 3

force:
    drag : 5
    jitter : 0.05
    gravity : 3

---

//global vars
var canvas = document.getElementById('backgroundCanvas');
var screen = {width:0, height:0};
var simu = {x:0,y:0,z:0};
var particleArray = [];
const particleType = new ParticleType({{page.particle.width}},{{page.particle.color}},{{page.particle.mass}}); //one particle type for now

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
    this.velocity = new Vec(0,0,0);
    this.width = S.width; //intented to be particle type
    this.color = S.color;
    this.mass = S.mass;
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

function removeCheck(particle){
    if(particle.life < 0 || particle.pos.x > screen.width || particle.pos.x < 0|| particle.pos.y > screen.height || particle.pos.y < 0)
        return false;
    return true;
}

function processParticle(){
    for (var i = 0; i < particleArray.length; i++) {
        physics(particleArray[i]);
        //decrease life
        particleArray[i].life--;
        
    }
}

//f = m * a
//a = m / f
//a = dv / t
//v = dx / t
//dx = v * t
//dx = dv
function physics(particle){
    aX = particle.force.x / particle.mass;
    aY = particle.force.y / particle.mass;
    aZ = particle.force.z / particle.mass;

    particle.velocity.x += aX;
    particle.velocity.y += aY;
    particle.velocity.z += aZ;

    particle.pos.x += particle.velocity.x;
    particle.pos.y += particle.velocity.y;
    particle.pos.z += particle.velocity.z;
    
    //drag


    dragX = 0.5 * {{page.force.drag}} * particle.velocity.x * particle.velocity.x;
    dragY = 0.5 * {{page.force.drag}} * particle.velocity.y * particle.velocity.y;
    dragZ = 0.5 * {{page.force.drag}} * particle.velocity.z * particle.velocity.z;

    if(particle.force.x > 0){
        particle.force.x -= dragX;
    }else{
        particle.force.x += dragX;
    }
    if(particle.force.y > 0){
        particle.force.y -= dragY;
    }else{
        particle.force.y += dragY;
    }
    if(particle.force.z > 0){
        particle.force.z -= dragZ;
    }else{
        particle.force.z += dragZ;
    }
    //jitter 
    particle.force.x += (Math.random() - 0.5)*{{page.force.jitter}};
    particle.force.y += (Math.random() - 0.5)*{{page.force.jitter}};
    particle.force.z += (Math.random() - 0.5)*{{page.force.jitter}};

}

function generateParticles(){
    let numberToGenerate = {{page.particles.number}} - particleArray.length;
    if (numberToGenerate > 0){
        for (var i = 0; i < numberToGenerate; i++) {
            if(Math.random() <= {{page.particles.oddsOfGeneration}}){
                var X = Math.random() * simu.x; //this needs to be !=0
                var Y = Math.random() * simu.y;
                var Z = Math.random() * simu.z;
                var life = Math.floor(Math.random()*{{page.particle.life}}); //revisit

                particleArray.push(new Particle(X,Y,Z,life, particleType)); 
            }
        }
    }
}

function update() {

    //kill off and remove off screen ones (mnaybe a good idea to add a buffer here because of big particles so edge + biggest size)
    particleArray = particleArray.filter(removeCheck);

    //process particles
    processParticle();

    //generate new particles
    generateParticles();
}

function draw() {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particleArray.length; i++) {

        context.beginPath();
        context.fillStyle = "#0050F0";
        context.arc(particleArray[i].pos.x, particleArray[i].pos.y, 2, 0, 2 * Math.PI);
        context.fill();
    }
}

function mainLoop() {

    if (canvas.getContext) {
        update();
        draw();
    }
    window.setTimeout(mainLoop, 1000/{{page.main.framerate}});

}
requestAnimationFrame(init);