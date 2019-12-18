"use strict";

const INTENSITY_SHIFT_PW = 1;
var PARTICLE_STEP = 10;
var MAX_PARTICLES = 8;
var SPAWNCHANGE_PW = 0.7;
const ATTRACTION_PW = 0.0008;
const ATTRICTION_PW = 0.982;
const JITTER_PW = 0.15;

const INITSPEED_PW = 5;

class Model_pW {
    constructor() {
        this.t = 0;
        this.particles = [];
    }
    update() {
        this.t++;
        var newP = this.getNewParticles();

        if (newP + this.particles.length > MAX_PARTICLES) {
            newP = this.particles.length - MAX_PARTICLES;
        }

        for (var i = 0; i < newP; i++) {
            if (Math.random() >= SPAWNCHANGE_PW) {
                continue;
            }
            var randomx = Math.random() * canvas.width;
            var randomy = Math.random() * canvas.height;
            this.particles.push(new Particle_pW(
                randomx,
                randomy,
                (Math.random() - 0.5) * INITSPEED_PW,
                (Math.random() - 0.5) * INITSPEED_PW,
                Math.random() * JITTER_PW,
                Math.random() * JITTER_PW,
                 canvas.width/2,
                 canvas.height/2,
                1,
                'white',
                Math.random() * 50 + 10));
        }
        for (var i = 0; i < this.particles.length; ++i) {
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
                break;
            }
            this.particles[i].life--;
            for (var j = 0; j < PARTICLE_STEP; ++j) {
                this.particles[i].update();
            }

        }

    }
    getNewParticles() {
        return Math.random() * 1;
    }
}
class Particle_pW {
    constructor(x, y, vx, vy, fx, fy, tx, ty, r, c, l) {
        this.position = new Point_pW(x, y);
        this.previous = new Point_pW(x, y);
        this.velocity = new Point_pW(vx, vy);
        this.vprevious = new Point_pW(vx, vy);
        this.force = new Point_pW(fx, fy);
        this.target = new Point_pW(tx, ty);
        this.size = r;
        this.color = c;
        this.life = l;
    }
    //draws current and previous position
    draw() {
        drawBezier(this.previous, this.position, this.vprevious, this.velocity, this.color, this.size);

        //}else{

        //}

    }
    applyForce() {
        var fx = (this.target.x - this.position.x) * ATTRACTION_PW;
        var fy = (this.target.y - this.position.y) * ATTRACTION_PW;

        fx += (Math.random() - 0.5) * JITTER_PW;
        fy += (Math.random() - 0.5) * JITTER_PW;

        this.force.x = fx;
        this.force.y = fy;

        this.velocity.x *= ATTRICTION_PW;
        this.velocity.y *= ATTRICTION_PW;

        this.velocity.x += this.force.x;
        this.velocity.y += this.force.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    update() {
        this.previous.x = this.position.x;
        this.previous.y = this.position.y;
        this.vprevious.x = this.velocity.x;
        this.vprevious.y = this.velocity.y;
        this.applyForce();
        this.draw();

    }
}

