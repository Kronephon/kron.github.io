const footerheight = 50;

// Set the scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - footerheight;

// Set some camera attributes.
var ASPECT = WIDTH / HEIGHT;
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;


// Get the DOM element to attach to
const canvas = document.getElementById('backgroundCanvas'); 
// Create a WebGL renderer, camera and a scene
const renderer = new THREE.WebGLRenderer({canvas: canvas});
canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight; // ?
renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);

const scene = new THREE.Scene();
// Start the renderer.
renderer.setSize(WIDTH, HEIGHT, true);
renderer.alpha = true;
renderer.antialias = true;


function updateScreenSize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight - footerheight;
  ASPECT = WIDTH / HEIGHT;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  
  camera.aspect = ASPECT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}




const camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
  );

// Add the camera to the scene.
scene.add(camera);
// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

// create the sphere's material
const sphereMaterial =
  new THREE.MeshLambertMaterial({
    color: 0xCC0000
  });

// Set up the sphere vars
const RADIUS = 50;
const SEGMENTS = 3;
const RINGS = 3;

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
var sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    RADIUS,
    SEGMENTS,
    RINGS),

  sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
sphere.position.z = -300;

// Finally, add the sphere to the scene.
scene.add(sphere);

function update() {
  // Draw!
  sphere.rotateX((Math.random()-0.5)*0.05);
  sphere.rotateY((Math.random()-0.5)*0.05);
  sphere.rotateZ((Math.random()-0.5)*0.05);
  renderer.render(scene, camera);

  // Schedule the next frame.
  requestAnimationFrame(update);
}
// Linkers
window.addEventListener('resize', updateScreenSize);
requestAnimationFrame(update);
