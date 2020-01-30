if (!THREE) {
    throw ("three.min.js not present");
}
const canvas = document.getElementById('aboutCanvas');
if (!canvas) {
    throw ("aboutCanvas not present");
}

//extra resources besides js or css

function loadResourcesAndStart(canvas) {
    loadFiles(['assets/js/aboutBackground/titaniaVertexShader.glsl',
        'assets/js/aboutBackground/titaniaFragmentShader.glsl',
        'assets/js/aboutBackground/postProcessingVertexShader.glsl',
        'assets/js/aboutBackground/postProcessingFragmentShader.glsl'],
        function callback(result) {
            aboutScene(result);
        },
        function errorCallback() {
            throw ("Error in loading pre requisites.");
        });
}

loadResourcesAndStart();
