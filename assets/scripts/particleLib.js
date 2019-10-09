//settings
const DRAG = 0.004;
const JITTER = 0.004;
const GRAVITY = 1;

particles:
const PLIMIT = 100;
const ODDS = 1;

//global vars
var simu {
    x = 0, y = 0, z = 0
};
var particleArray = [];
const particleType = new ParticleType(1, "color", 10); //one particle type for now

//init routine
function updateSimu(x, y, z) {
    simu.x = x;
    simu.y = y;
    simu.z = z;
}

function ParticleType(W, C, M) {
    this.width = W;
    this.color = C;
    this.mass = M;
}

function Particle(X, Y, Z, N, S) {
    this.life = N;
    this.pos = new Vec(X, Y, Z);
    this.force = new Vec(0, 0, 0);
    this.velocity = new Vec(0, 0, 0);
    this.width = S.width; //intented to be particle type
    this.color = S.color;
    this.mass = S.mass;
}

function Vec(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function removeCheck(particle) {
    if (particle.life < 0 || 
        particle.pos.x > simu.x || particle.pos.x < 0 || 
        particle.pos.y > simu.y || particle.pos.y < 0 ||
        particle.pos.z > simu.z || particle.pos.z < 0)
        return false;
    return true;
}

function processParticle() {
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
function physics(particle) {
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

    dragX = 0.5 * DRAG * particle.velocity.x * particle.velocity.x;
    dragY = 0.5 * DRAG * particle.velocity.y * particle.velocity.y;
    dragZ = 0.5 * DRAG * particle.velocity.z * particle.velocity.z;

    if (particle.velocity.x > 0) {
        particle.force.x -= dragX;
    } else {
        particle.force.x += dragX;
    }
    if (particle.velocity.y > 0) {
        particle.force.y -= dragY;
    } else {
        particle.force.y += dragY;
    }
    if (particle.velocity.z > 0) {
        particle.force.z -= dragZ;
    } else {
        particle.force.z += dragZ;
    }
    //jitter 
    particle.force.x += (Math.random() - 0.5) * JITTER;
    particle.force.y += (Math.random() - 0.5) * JITTER;
    particle.force.z += (Math.random() - 0.5) * JITTER;

}

function generateParticles() {
    let numberToGenerate = {
        {
            page.particles.number
        }
    } - particleArray.length;
    if (numberToGenerate > 0) {
        for (var i = 0; i < numberToGenerate; i++) {
            if (Math.random() <= {
                    {
                        page.particles.oddsOfGeneration
                    }
                }) {
                var X = Math.random() * simu.x; //this needs to be !=0
                var Y = Math.random() * simu.y;
                var Z = Math.random() * simu.z;
                var life = Math.floor(Math.random() * {
                    {
                        page.particle.life
                    }
                }); //revisit

                particleArray.push(new Particle(X, Y, Z, life, particleType));
            }
        }
    }
}

function update() {

    //kill off and remove off screen ones (mnaybe a good idea to add a buffer here because of big particles so edge + biggest size)
    //particleArray = particleArray.filter(removeCheck);

    //process particles
    processParticle();

    //generate new particles
    generateParticles();
}

