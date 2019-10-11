class krParticle extends THREE.Mesh { // perhaps look into making it into a point? 
    constructor(x,y,z,mass, vx, vy, vz, fx,fy,fz, colorHex, life, size) {
        super();

        this.mass = mass;
        this.velocity = new THREE.Vector3( vx, vy, vz );
        this.force = new THREE.Vector3( fx, fy, fz );
        this.color = colorHex;
        this.life = life; //-1 for don't die
        this.size = size;
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;

    }
}

//outStruct must have a save method
//TODO maybe add velocity and force random inputs?
function ksParticlesInit(outStruct, particleNumber, particle, xMin, xMax, yMin, yMax, zMin, zMax){
    for(i = 0; i <= particleNumber ;i++){
        var newParticle = particle.clone();
        newParticle.position.x = Math.random()*(xMax-xMin) + xMin;
        newParticle.position.y = Math.random()*(yMax-yMin) + yMin;
        newParticle.position.z = Math.random()*(zMax-zMin) + zMin;
        outStruct.save();
    }
}

function particleProcess(particle){

}

var particle = new krParticle(10,0,0, 10, 0,0,0, 0,0,0, 0xFFFFFF, 10, 10);


console.log("hi " + particle.position.x);

/*

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
  new THREE.PointLight(0x1D171C);

// set its position
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

// add to the scene
scene.add(pointLight);

var ambientLight = new THREE.AmbientLight( 0x1D171C, 1 );
scene.add(ambientLight);

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
  sphere.rotateY((Math.random()+0.5)*0.08);
  sphere.rotateZ((Math.random()-0.5)*0.05);
  renderer.setClearColor( 0xffffff, 0);
  renderer.render(scene, camera);

  // Schedule the next frame.
  requestAnimationFrame(update);
}
// Linkers
window.addEventListener('resize', updateScreenSize);
requestAnimationFrame(update);
*/