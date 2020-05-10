var canvas_sp, scene_sp, camera_sp, renderer_sp, composer_sp, shaderPass_sp, world_sp;

class postProcessingShader_sp {
    constructor(vertexShader, fragmentShader) {
        this.uniforms = {
            tDiffuse: { type: 'float', value: null },
            amount: { type: 'float', value: 1.0 },
            windowsResolution: { type: 'vec2', value: renderer_sp.getSize() }
        };
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }
}


function paralaxInit() {
    camera_sp.userData.target = new THREE.Vector3(0, 0, 0);
    camera_sp.userData.cameraLook = new THREE.Vector3(0, 0, 0);
    camera_sp.userData.velocity = new THREE.Vector3(0, 0, 0);
    camera_sp.userData.attraction = 0.001;
    camera_sp.userData.attriction = 0.01;
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function paralax() {
    var fx = (camera_sp.userData.target.x - camera_sp.userData.cameraLook.x) * camera_sp.userData.attraction;
    var fy = (camera_sp.userData.target.y - camera_sp.userData.cameraLook.y) * camera_sp.userData.attraction;

    camera_sp.userData.velocity.x += fx;
    camera_sp.userData.velocity.y += fy;

    camera_sp.userData.cameraLook.x += camera_sp.userData.velocity.x;
    camera_sp.userData.cameraLook.y += camera_sp.userData.velocity.y;

    camera_sp.lookAt(camera_sp.userData.cameraLook);

    camera_sp.userData.velocity.x *= camera_sp.userData.attriction;
    camera_sp.userData.velocity.y *= camera_sp.userData.attriction;
}

function onDocumentMouseMove(event) {
    camera_sp.userData.target.x = 2 * (event.clientX / window.innerWidth - 0.5) * 0.75;
    camera_sp.userData.target.y = -2 * (event.clientY / window.innerWidth - 0.5) * 0.75;
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
};


function sceneSetup(postProcessingShader){
    scene_sp = new THREE.Scene();
    camera_sp = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera_sp.position.z = 5;
    paralaxInit();
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
    var statue = resources[6];

    sceneSetup(postProcessingShader);
    worldSetup(gateShader, backgroundShader);

    function animate() {
        paralax();
        world_sp.update();
        composer_sp.render();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}