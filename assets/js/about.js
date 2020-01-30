if(!THREE){
    throw ("three.min.js not present");
}
const canvas = document.getElementById('aboutCanvas');
if(!canvas){
    throw ("aboutCanvas not present");
}

//extra resources besides js or css
var statueVertexShader, statueFragmentShader;

function loadResourcesAndStart(canvas){
    loadFiles(['assets/js/aboutBackground/titaniaVertexShader.glsl', 'assets/js/aboutBackground/titaniaFragmentShader.glsl'], 
    function callback(result){
        statueVertexShader = result[0];
        statueFragmentShader = result[1]
        aboutScene([statueVertexShader, statueFragmentShader]);
    },
    function errorCallback(){
        throw ("Error in loading pre requisites.");
    });
}

loadResourcesAndStart();
