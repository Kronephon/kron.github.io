const footerheight = 50;

// Set the scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - footerheight;

///////////////////////////////////////////////////////////////////

// Set some camera attributes.
var ASPECT = WIDTH / HEIGHT;
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const canvas = document.getElementById('backgroundCanvas'); 
// Create a WebGL renderer, camera and a scene
const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight; // ?
renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);

function updateScreenSize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight - footerheight;
  ASPECT = WIDTH / HEIGHT;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  
  CAMERA.aspect = ASPECT;
  CAMERA.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}

const SCENE = new THREE.Scene();
// Start the renderer.
renderer.setSize(WIDTH, HEIGHT, true);
renderer.alpha = true;
renderer.antialias = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const CAMERA =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
  );

// Add the camera to the scene.
CAMERA.position.z += 400;
//CAMERA.position.y = 5;
SCENE.add(CAMERA);

// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 0;

pointLight.castShadow = true; 
// add to the scene
SCENE.add(pointLight);

var ambientLight = new THREE.AmbientLight( 0x1D171C, 1 );
SCENE.add(ambientLight);

///////////////////////////////////////////////////////////////////
var model = new KRModel();

function update() {
  //logic
  model.update();

  // Draw!
  renderer.setClearColor(0xffffff, 0);
  renderer.render(SCENE, CAMERA);

  // Schedule the next frame.
  requestAnimationFrame(update);
}

///////////////////////////////////////////////////////////////////

//IO

document.onmousedown= function(event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event===undefined) event= window.event;
  var target= 'target' in event? event.target : event.srcElement;

  model.click();
};

document.onmouseup= function(event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event===undefined) event= window.event;
  var target= 'target' in event? event.target : event.srcElement;

  model.declick();
};
///////////////////////////////////////////////////////////////////

// Linkers
window.addEventListener('resize', updateScreenSize);
requestAnimationFrame(update);
