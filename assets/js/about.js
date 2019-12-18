if(!THREE){
    throw ("three.min.js not present");
}
const canvas = document.getElementById('aboutCanvas');
if(!canvas){
    throw ("aboutCanvas not present");
}

aboutSceneInit(canvas);