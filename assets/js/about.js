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

        'assets/js/aboutBackground/pointVertex.glsl',
        'assets/js/aboutBackground/pointFragment.glsl'
        ],
        function callback(result) {
            aboutScene(result);
        },
        function errorCallback() {
            throw ("Error in loading pre requisites. Missing Files.");
        });
}

loadResourcesAndStart();
