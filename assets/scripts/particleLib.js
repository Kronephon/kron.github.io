---

---

// Draw whatever else over top of it on the canvas.

//init routine
window.addEventListener('resize', updateScreenSize);

var canvas = document.getElementById('backgroundCanvas');
//if(!canvas){
//    alert("no canvas");
//}

var windowsWidth;
var windowsHeight;
updateScreenSize();


var particleSettings = {
    width: 1 //expressed in pixels
};

var particleArray = [];

for (var i = 0; i < Math.floor(Math.random() * 20000); i++) { //todo: port number
    var particle = {
        width: particleSettings.width,
        X: Math.random() * windowsWidth,
        Y: Math.random() * windowsHeight,
        Z: Math.random() * windowsHeight
    }
    particleArray[i] = particle;
    // more statements
}


requestAnimationFrame(mainLoop);

function updateScreenSize(){
    var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    windowsWidth = win.innerWidth; // in pixels
    windowsHeight = win.innerHeight; // in pixels
}

function update() {
    canvas.width = windowsWidth; // in pixels
    canvas.height = windowsHeight - 25; // in pixels

    for (var i = 0; i < particleArray.length; i++) {
        particleArray[i].X = (particleArray[i].X + (Math.random() * 2 - 1)*0.15)  % windowsWidth;
        particleArray[i].Y = (particleArray[i].Y + (Math.random() * 2 - 1)*0.15)  % windowsHeight;
        particleArray[i].Z = (particleArray[i].Z + (Math.random() * 2 - 1)*0.15)  % windowsHeight;
    }
}


function getDoF(input) { //target is -1 to 1
    var middle = windowsHeight/2;
    var norm = (windowsHeight -input)/windowsHeight;
    return Math.abs(norm);
}

function draw() {
    var ctx = canvas.getContext('2d');

    for (var i = 0; i < particleArray.length; i++) {
        ctx.beginPath();
        ctx.arc(particleArray[i].X, particleArray[i].Y, particleArray[i].width, 0, 2 * Math.PI, false);
        ctx.lineWidth = getDoF(particleArray[i].Z) * 10;
        ctx.strokeStyle = "#82718B";
        ctx.stroke();
        //Do something
    }
    //ctx.beginPath();
    //ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    //ctx.lineWidth = 3;
    //ctx.strokeStyle = '#FF0000';
    // ctx.stroke();

}

function mainLoop() {

    if (canvas.getContext) {
        update();
        draw();

    }
    setTimeout(mainLoop, 1 / 60);

}