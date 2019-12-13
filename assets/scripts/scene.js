const footerheight = 0;

// Set the scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - footerheight;

///////////////////////////////////////////////////////////////////

var TARGET = './assets/models/trajan_print.stl';

///////////////////////////////////////////////////////////////////

// Set some camera attributes.
var ASPECT = WIDTH / HEIGHT;
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const canvas = document.getElementById('backgroundCanvas');
// Create a WebGL renderer, camera and a scene
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight; // ?
renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);

function updateScreenSize() {
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
renderer.setPixelRatio(2);

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

//pointLight.castShadow = true;
// add to the scene
SCENE.add(pointLight);

var ambientLight = new THREE.AmbientLight(0x1D171C, 1);
SCENE.add(ambientLight);

///////////////////////////////////////////////////////////////////
var MODEL = new KrModel();

var rotation = 0;
var center = new THREE.Vector3( 0, 0, 0 );

const onLoad = (gltf) => {
  console.log(gltf)
  const targetmodel = gltf.scene.children[1]; //check model for it
  targetmodel.name = "target";
  SCENE.add( targetmodel );
  MODEL.loadComplete();
};
targetLoader = new THREE.GLTFLoader();

targetLoader.load(
// parameter 1: The URL
'assets/models/achilles.gltf',
// parameter 2:The onLoad callback
gltf => onLoad( gltf, )
);

function update() {
  rotation = 0.05;
  CAMERA.position.x = Math.sin(rotation)* 500 + center.x;
  CAMERA.position.y = 300 + center.y;
  CAMERA.position.z = Math.cos(rotation)* 500  + center.y;
  CAMERA.lookAt( new THREE.Vector3( 0,200, 0 )); // the origin

  //logic
  MODEL.update();

  // Draw!
  renderer.render(SCENE, CAMERA);

  // Schedule the next frame.
  requestAnimationFrame(update);
}

///////////////////////////////////////////////////////////////////

//IO
document.ontouchstart = function (event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event === undefined) event = window.event;
  var target = 'target' in event ? event.target : event.srcElement;

  MODEL.click();
};

document.ontouchend = function (event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event === undefined) event = window.event;
  var target = 'target' in event ? event.target : event.srcElement;

  MODEL.click();
};


document.onmousedown = function (event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event === undefined) event = window.event;
  var target = 'target' in event ? event.target : event.srcElement;

  MODEL.click();
};

document.onmouseup = document.ontouchend = function (event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event === undefined) event = window.event;
  var target = 'target' in event ? event.target : event.srcElement;

  MODEL.declick();
};


///////////////////////////////////////////////////////////////////

// Linkers
window.addEventListener('resize', updateScreenSize);
requestAnimationFrame(update);

