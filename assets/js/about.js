if (!THREE) {
    throw ("three.min.js not present");
}
const canvas = document.getElementById('aboutCanvas');
if (!canvas) {
    throw ("aboutCanvas not present");
}

//extra resources besides js or css

function loadResourcesAndStart(canvas) {
    loadFiles([
        'assets/js/aboutBackground/postProcessingVertexShader.glsl',
        'assets/js/aboutBackground/postProcessingFragmentShader.glsl',

        'assets/js/aboutBackground/gateVertexShader.glsl',
        'assets/js/aboutBackground/gateFragmentShader.glsl',

        'assets/js/aboutBackground/worldBackgroundVertexShader.glsl',
        'assets/js/aboutBackground/worldBackgroundFragmentShader.glsl',
        ],
        function callback(result) {
            //loadGLTF(result);
            finishLoading(result);
        },
        function errorCallback() {
            throw ("Error in loading pre requisites. Missing Files.");
        });
}

//bypass due to dedicated THREEjs loaders/parsers
function loadGLTF(result) {

    const gltfLoader = new THREE.GLTFLoader();

    gltfLoader.load('assets/poly/trajan.gltf',
        function callback(gltf) {
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh ) {
                    result.push(child);
                }
            } );
            aboutScene(result);
        });
}

function finishLoading(result){
    element = document.getElementById("loader");
    if(typeof(element) !== 'undefined'){
        element.style.display = "none";
        aboutScene(result); 
    }
    
}
console.log("Cheeky little one aren't you? :)");
window.onload = loadResourcesAndStart();
