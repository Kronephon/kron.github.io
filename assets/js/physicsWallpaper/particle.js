"use strict";

class Particle{
    constructor(x, y, vx, vy, fx, fy, r){
        this.matrix = new TransMatrix().translation*(x,y);
        console.log(this.matrix);
    }
}