var canvas_sp, scene_sp, camera_sp, renderer_sp;
/*
function paralaxInit(){
    camera_sp.userData.target = new THREE.Vector3(0,0,0);
    camera_sp.userData.cameraLook = new THREE.Vector3(0,0,0);
    camera_sp.userData.velocity = new THREE.Vector3(0,0,0);
    camera_sp.userData.attraction = 0.001;
    camera_sp.userData.attriction = 0.01;
    document.addEventListener('mousemove', onDocumentMouseMove, false );
}
function paralax(){
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
}*/

window.onresize = function (event) {
    renderer_sp.setSize(window.innerWidth, window.innerHeight);

    var width = window.innerWidth;
    var height = window.innerHeight;
    camera_sp.aspect = width / height;
    camera_sp.updateProjectionMatrix();
    renderer_sp.setSize(width, height);
};

function aboutScene(canvas) {
    scene_sp = new THREE.Scene();
    camera_sp = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera_sp.position.z = 5;

    renderer_sp = new THREE.WebGLRenderer();
    renderer_sp.setSize(window.innerWidth, window.innerHeight); // change this for smaller resolutions (setSize(window.innerWidth/2, window.innerHeight/2, false) )    
    document.body.appendChild(renderer_sp.domElement);

    geometry = new THREE.IcosahedronBufferGeometry(1.5, 5);
    material = new THREE.MeshNormalMaterial({
        transparent: true
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene_sp.add(this.mesh);
    mesh.position.z = -1.0;
    mesh.position.x = 1.0;
    mesh.material.opacity = 0.5;

    function animate() {
        //paralax();

        renderer_sp.render(scene_sp, camera_sp);
        requestAnimationFrame(animate);
    }
    animate();
}