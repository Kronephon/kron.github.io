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

        'assets/js/aboutBackground/gateVertex.glsl',
        'assets/js/aboutBackground/gateFragment.glsl',
        ],
        function callback(result) {
            loadGLTF(result);
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

loadResourcesAndStart();
