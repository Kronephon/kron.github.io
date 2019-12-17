"use strict";

const INTENSITY_SHIFT_PW = 1;

class Model_pW{
    constructor(){
        this.t = 0;
        this.particles = [];
    }
    update(){
        this.t++;
        var limit = this.getNewParticles();
        for(var i = 0;i < limit;i++){
            var randomx = Math.random()*canvas.width;
            var randomy = Math.random()*canvas.height;
            this.particles.push(new Particle_pW(
                randomx,
                randomy,
                Math.random(),
                Math.random(),
                Math.random(),
                Math.random(),
                0,
                0,
                1,
                'white'));
        }
        this.particles.forEach(particle => {
            particle.draw();
            
        })
    }
    getNewParticles(){
        //abs(cos(x) * sin(x + Pi* 0.3) * 3 *sin(x + 0.2) * tan(x + 0.4))
        return     Math.random()*20 + 20 * Math.max(Math.sin(this.t * 0.1),0) + 
                   20 * Math.max(Math.cos(this.t * 0.2 + 50),0) + 
                   50 * (Math.sin(this.t * Math.random() * 0.01));
    }
}
class Particle_pW{
    constructor(x, y, vx, vy, fx, fy, tx, ty, r, c){
        this.position = new Point(x,y);
        this.previous = new Point(x,y);
        this.velocity = new Point(vx,vy);
        this.force = new Point(fx,fy);
        this.target = new Point(tx, ty);
        this.size = r;
        this.color = c;
    }
    //draws current and previous position
    draw(){
        //if(this.position.eq(this.previous)){
            console.log(this.position);
            drawCircle(this.position, this.r, this.c);
        //}else{

        //}
        
    }
    update(){

    }
}