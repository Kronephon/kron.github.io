var canvas_sp, scene_sp, camera_sp, renderer_sp, composer_sp, shaderPass_sp, world_sp;

class postProcessingShader_sp {
    constructor(vertexShader, fragmentShader) {
        this.uniforms = {
            tDiffuse: { type: 'float', value: null },
            amount: { type: 'float', value: 1.0 },
            windowsResolution: { type: 'vec2', value: renderer_sp.getSize()},
            clock: {type: 'float', value: 0.0},
            clicked: {type: 'bool', value: false}
        };
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }
}

function onMouseMove(event) {
    world_sp.updateStars();
}

function onPressStart(event) {
    shaderPass_sp.uniforms.clicked.value = true;
}

function onPressEnd(event) {
    shaderPass_sp.uniforms.clicked.value = false;
}

function onKeyPress(event) {
    var cameraspeed = 0.01;
    if (event.key == "w") {
        camera_sp.position.z -= cameraspeed;
    }
    if (event.key == "s") {
        camera_sp.position.z += cameraspeed;
    }
    if (event.key == "a") {
        camera_sp.position.x -= cameraspeed;
    }
    if (event.key == "d") {
        camera_sp.position.x += cameraspeed;
    }
    if (event.key == " ") {
        camera_sp.position.y += cameraspeed;
    }
}

window.onresize = function(event) {
    renderer_sp.setSize(window.innerWidth, window.innerHeight);

    var width = window.innerWidth;
    var height = window.innerHeight;
    camera_sp.aspect = width / height;
    camera_sp.updateProjectionMatrix();
    renderer_sp.setSize(width, height);
    composer_sp.setSize(width, height);
};


function sceneSetup(postProcessingShader){
    scene_sp = new THREE.Scene();
    camera_sp = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera_sp.position.z = 4;
    camera_sp.position.y = -0.4;
    document.addEventListener('mousedown', onPressStart, false);
    document.addEventListener('touchstart', onPressStart, false);
    document.addEventListener('mouseup', onPressEnd, false);
    document.addEventListener('touchend', onPressEnd, false);

    //document.addEventListener('mousemove', onMouseMove,false);
    document.addEventListener('keydown', onKeyPress, false); //test camera controls
    renderer_sp = new THREE.WebGLRenderer();
    renderer_sp.setSize(window.innerWidth, window.innerHeight); // change this for smaller resolutions (setSize(window.innerWidth/2, window.innerHeight/2, false) )    
    document.body.appendChild(renderer_sp.domElement);

    composer_sp = new THREE.EffectComposer(renderer_sp);
    renderPass_sp = new RenderPass(scene_sp, camera_sp);
    composer_sp.addPass(renderPass_sp);

    shaderPass_sp = new THREE.ShaderPass(new postProcessingShader_sp(postProcessingShader[0], postProcessingShader[1]));
    composer_sp.addPass(shaderPass_sp);
}

function worldSetup(gateShader, backgroundShader){
    world_sp = new KrWorld(gateShader, backgroundShader);
}

function aboutScene(resources) {
    var postProcessingShader = [resources[0], resources[1]];
    var gateShader   = [resources[2], resources[3]];
    var backgroundShader   = [resources[4], resources[5]];
    //var statue = resources[6];

    sceneSetup(postProcessingShader);
    worldSetup(gateShader, backgroundShader);
    const clock = new THREE.Clock();

    function animate() {
        //paralax();
        world_sp.update(clock.getElapsedTime());
        shaderPass_sp.uniforms.clock.value = clock.getElapsedTime();
        composer_sp.render();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}