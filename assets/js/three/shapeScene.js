var canvas_sp, scene_sp, camera_sp, renderer_sp;



window.onresize = function(event) {
    renderer_sp.setSize(window.innerWidth, window.innerHeight); 
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera_sp.aspect = width / height;
    camera_sp.updateProjectionMatrix();
    renderer_sp.setSize( width, height );
};


function aboutSceneInit(canvas) {

    scene_sp = new THREE.Scene();
    camera_sp = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer_sp = new THREE.WebGLRenderer();
    renderer_sp.setSize(window.innerWidth, window.innerHeight); // change this for smaller resolutions (setSize(window.innerWidth/2, window.innerHeight/2, false) )    
    document.body.appendChild(renderer_sp.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    var cube = new THREE.Mesh(geometry, material);
    scene_sp.add(cube);

    camera_sp.position.z = 5;

    var backgroundStars = new Stars_sp();
    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        requestAnimationFrame(animate);
        renderer_sp.render(scene_sp, camera_sp);
    }
    animate();
}
