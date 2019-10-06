---

---

// Draw whatever else over top of it on the canvas.

window.addEventListener('resize', draw);
var canvas = document.getElementById('backgroundCanvas');
var X;
var Y;
var R;

var particle = {
    width: 2, //expressed in pixels
    x: 0,
    y: 0
};


function update() {
    var win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    canvas.width = win.innerWidth; // in pixels
    canvas.height = win.innerHeight - 25; // in pixels

    X = canvas.width / 2;
    Y = canvas.height / 2;
    R = Math.random() * 50;
}


function draw() {

    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
    }
}

function mainLoop() {

    if (canvas) {
        update();
        draw();

    }
    setTimeout(mainLoop, 1 / 60);

}


// Start things off
//requestAnimationFrame(mainLoop);