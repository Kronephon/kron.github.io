"use strict";
//assumes external initialization of context and canvas
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    mul(c){
        this.x *= c;
        this.y *= c;
    }
    eq(point){
        return (this.x == point.x && this.y == point.y);
    }
}

function drawCircle(point, radius, color){
    ctx_pW.beginPath();
    ctx_pW.moveTo(point.x, point.y);
    
    ctx_pW.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    ctx_pW.fillStyle = color;
    ctx_pW.fill();
}

function drawBezier(point1, point2, intensity1, intensity2, color){
    ctx.beginPath();
    ctx.moveTo(188, 130);
    ctx.bezierCurveTo(140, 10, 388, 10, 388, 170);
    ctx.lineWidth = 10;

    // line color
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

/*
function drawHexagon(canvas, matrix, strokeColor, fillColor) {
    if (!canvas) {
        return;
    }
    
    var points = [new Point(0.5 ,  1),
                  new Point(1   ,  0),
                  new Point(0.5 , -1),
                  new Point(-0.5, -1),
                  new Point(-1  ,  0),
                  new Point(-0.5,  1)
    ];

    points.forEach(point => {
        matrix.applyMatrix(point);
    });

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p6.x, p6.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.stroke();
    ctx.fill();
    ctx.closePath(); 
}*/

/*class TransMatrix{
    /*    see https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/geometry/geo-tran.html
     *    for more info.
     *    c1 c2 c3
     *    c4 c5 c6
     *    c7 c8 c9 
     *//*
    constructor(){
        this.c1 = 1;
        this.c2 = 0;
        this.c3 = 0;

        this.c4 = 0;
        this.c5 = 1;
        this.c6 = 0;

        this.c7 = 0;
        this.c8 = 0;
        this.c9 = 1;
    }

    applyMatrix(point){
        var x = point.x, y = point.y;
        point.x = this.c1*x + this.c2*y + this.c3;
        point.y = this.c4*x + this.c5*y + this.c6;
    }

    copy(){
        var matrix = new TransMatrix();
        matrix.c1 = this.c1;
        matrix.c2 = this.c2;
        matrix.c3 = this.c3;

        matrix.c4 = this.c4;
        matrix.c5 = this.c5;
        matrix.c6 = this.c6;

        matrix.c7 = this.c7;
        matrix.c8 = this.c8;
        matrix.c9 = this.c9;
        return matrix;
    }

    m(matrix){
        var newMatrix = new TransMatrix();
       
        newMatrix.c1 = this.c1*matrix.c1 + this.c2*matrix.c4 + this.c3*matrix.c7;
        newMatrix.c2 = this.c1*matrix.c2 + this.c2*matrix.c5 + this.c3*matrix.c8;
        newMatrix.c3 = this.c1*matrix.c3 + this.c2*matrix.c6 + this.c3*matrix.c9;

        newMatrix.c4 = this.c4*matrix.c1 + this.c5*matrix.c4 + this.c6*matrix.c7;
        newMatrix.c5 = this.c4*matrix.c2 + this.c5*matrix.c5 + this.c6*matrix.c8;
        newMatrix.c6 = this.c4*matrix.c3 + this.c5*matrix.c6 + this.c6*matrix.c9;
        
        newMatrix.c7 = this.c7*matrix.c1 + this.c8*matrix.c4 + this.c9*matrix.c7;
        newMatrix.c8 = this.c7*matrix.c2 + this.c8*matrix.c5 + this.c9*matrix.c8;
        newMatrix.c9 = this.c7*matrix.c3 + this.c8*matrix.c6 + this.c9*matrix.c9;

        return newMatrix;
    }

    translation(x,y){
        var newMatrix = new TransMatrix();

        newMatrix.c3 = x;
        newMatrix.c6 = y;

        return this.m(newMatrix);
    }
    scale(s){
        var newMatrix = new TransMatrix();

        newMatrix.c1 = s;
        newMatrix.c5 = s;

        return this.m(newMatrix);
    }
    rotation(r){ //radians
        var newMatrix = new TransMatrix();

        newMatrix.c1 = Math.cos(r);
        newMatrix.c2 = -Math.sin(r);
        newMatrix.c4 = Math.sin(r);
        newMatrix.c5 = Math.cos(r);

        return this.m(newMatrix);
    }
}


}*/