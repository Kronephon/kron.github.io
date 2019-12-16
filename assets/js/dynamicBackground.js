// simple 2d html5 interface
"use strict";
class Shape {
    constructor(position, rotation, scale, drawFunction){
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.draw = drawFunction;
    }
}

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    mul(c){
        this.x *= c;
        this.y *= c;
    }
    applyMatrix(matrix){ //x'= kx
        this.x = matrix[0][0]*this.x + matrix[1][0]*this.x;
        this.y = matrix[0][1]*this.y + matrix[1][1]*this.y;
    }
}

class TransMatrix{
    /*    see https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/geometry/geo-tran.html
     *    for more info.
     *    c1 c2 c3
     *    c4 c5 c6
     *    c7 c8 c9 
     */
    constructor(){
        this.c1 = 1;
        this.c2 = c2;
        this.c3 = c3;
        this.c4 = c4;
    }
    applyMatrix(point){
        point.x = this.c1*point.x + this.c2*point.x;
        point.y = this.c3*point.y + this.c4*point.y;
    }
    translation(x,y){

    }
    scale(s){

    }
    rotation(r){ //radians

    }
}

function drawHexagon(canvas, matrix, strokeColor, fillColor) {
    if (!canvas) {
        return;
    }
    
    var points = [new Point(0.5, 1),
        new Point(0.5, 1),
        new Point(1, 0),
        new Point(0.5, -1),
        new Point(-0.5, -1),
        new Point(-1, 0),
        new Point(-0.5, 1)
    ];

    points.forEach(point => {
        matrix.applyMatrix(point);
    });

    drawHexagonLit(canvas,points[0],points[1],points[2],points[3],points[4],points[5], "red", "green");
}

function drawHexagonLit(canvas, p1, p2, p3 ,p4 ,p5, p6, strokeColor, fillColor){ // add border cases here
    if(!canvas){
        return;
    }
    var ctx = canvas.getContext("2d");
    if(!ctx){
        return;
    }
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p6.x, p6.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.strokeStyle = strokeColor;
    ctx.fillColor = fillColor;
    ctx.stroke();
}


function dynamicBackgroundInit(canvas){
    if(!canvas){
        return;
    }
    var worldMatrix = new TransMatrix(1,0,0,1);
    console.log(worldMatrix);
    drawHexagon(canvas, worldMatrix, "red", "green");
}