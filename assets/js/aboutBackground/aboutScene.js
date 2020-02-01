var canvas_sp, scene_sp, camera_sp, renderer_sp, composer_sp, shaderPass_sp;

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
    if(event.key == "w"){
        camera_sp.position.z -= cameraspeed;
    }
    if(event.key == "s"){
        camera_sp.position.z += cameraspeed;
    }
    if(event.key == "a"){
        camera_sp.position.x -= cameraspeed;
    }
    if(event.key == "d"){
        camera_sp.position.x += cameraspeed;
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

function aboutScene(resources) {
    var titaniaVertexShader = resources[0];
    var titaniaFragmentShader = resources[1];
    var postProcessingVertex = resources[2];
    var postProcessingFragment = resources[3];

    scene_sp = new THREE.Scene();
    camera_sp = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera_sp.position.z = 5;

    paralaxInit();
    document.addEventListener('keydown', onKeyPress, false); //test camera controls
    renderer_sp = new THREE.WebGLRenderer();
    renderer_sp.setSize(window.innerWidth, window.innerHeight); // change this for smaller resolutions (setSize(window.innerWidth/2, window.innerHeight/2, false) )    
    document.body.appendChild(renderer_sp.domElement);

    composer_sp = new THREE.EffectComposer(renderer_sp);
    renderPass_sp = new RenderPass(scene_sp, camera_sp);
    composer_sp.addPass(renderPass_sp);

    titania_sp = new titania_sp(titaniaVertexShader, titaniaFragmentShader, scene_sp);

    shaderPass_sp = new THREE.ShaderPass(new postProcessingShader_sp(postProcessingVertex, postProcessingFragment));
    composer_sp.addPass(shaderPass_sp);

    //test stuff
    geometry = new THREE.IcosahedronBufferGeometry(5, 5);
    material = new THREE.MeshNormalMaterial({
        transparent: true,
        side: THREE.DoubleSide
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene_sp.add(this.mesh);

    function animate() {
        paralax();
        composer_sp.render();
        requestAnimationFrame(animate);
    }
    animate();
}