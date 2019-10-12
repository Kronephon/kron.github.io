const footerheight = 50;
const particlesSpawn = 50;
const oddsOfGeneration = 0.05;

// Set the scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - footerheight;

// Set some camera attributes.
var ASPECT = WIDTH / HEIGHT;
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;


///////////////////////////////////////////////////////////////////


//var frustum = new THREE.Frustum();
//frustum.setFromMatrix( new THREE.Matrix4().multiply( camera.projectionMatrix, camera.matrixWorldInverse ) );

//for (var i=0; i<objects.length; i++) {
  //objects[i].visible = frustum.intersectsObject( objects[i] );
//  frustum.


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
  
  camera.aspect = ASPECT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}

const scene = new THREE.Scene();
// Start the renderer.
renderer.setSize(WIDTH, HEIGHT, true);
renderer.alpha = true;
renderer.antialias = true;


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

var ambientLight = new THREE.AmbientLight( 0x1D171C, 1 );
scene.add(ambientLight);

///////////////////////////////////////////////////////////////////

// create the sphere's material
const sphereMaterial =
  new THREE.MeshLambertMaterial({
    color: 0xCC0000
  });

  
// Set up the sphere vars
const RADIUS = 5;
const SEGMENTS = 3;
const RINGS = 3;


// https://github.com/collinhover/threeoctree

var octree = new THREE.Octree({
	undeferred: false, // optional, default = false, octree will defer insertion until you call octree.update();
	depthMax: Infinity, // optional, default = Infinity, infinite depth
	objectsThreshold: 8, // optional, default = 8
	overlapPct: 0.15, // optional, default = 0.15 (15%), this helps sort objects that overlap nodes
	scene: scene // optional, pass scene as parameter only if you wish to visualize octree
} );

var numParticle = 10;

var particle = new krParticle(new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS), sphereMaterial, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0xFFFFFF, 10, 10);

ksParticlesInit(numParticle, particle, -50, 50, -50, 50, -50, 50);

camera.position.z += 60;
camera.position.y = 5;


function update() {
  // Draw!
  KrParticlesUpdate();

  renderer.setClearColor( 0xffffff, 0);
  renderer.render(scene, camera);

  // Schedule the next frame.
  requestAnimationFrame(update);
}

///////////////////////////////////////////////////////////////////

// Linkers
window.addEventListener('resize', updateScreenSize);
requestAnimationFrame(update);
