class KRParticle extends THREE.Mesh {
  constructor(param) { //takes a set of parameters, some might be mandatory check below
    super();
  }

  loadSettings(param) {
    if (typeof param === 'undefined') {
      console.log("KRParticle loadSettings param undefined.")
      return;
    }
    console.log("Creating new KRParticle type");
    for (var key in param) {
      if (this.hasOwnProperty(key)) {
        if (key == "position") {
          this.position.x = param[key].x;
          this.position.y = param[key].y;
          this.position.z = param[key].z;
          console.log(key + " -> " + this[key]);
        } else {
          this[key] = param[key];
          console.log(key + " -> " + this[key]);
        }
      } else {
        this.userData[key] = param[key];
        console.log(key + " [userData]-> " + this.userData[key]);
      }
    }
  }

  changeMesh(mesh) {
    super.geometry = mesh.geometry;
    super.material = mesh.material;
  }

  setPosition(x, y, z) {
    if (x === 'undefined' || y === 'undefined' || z === 'undefined') {
      console.log("KRParticle setPosition has undefined args. Setting to 0.");
      this.position.x = 0;
      this.position.y = 0;
      this.position.z = 0;
    } else {
      this.position.x = x;
      this.position.y = y;
      this.position.z = z;
    }
  }

  process() {

    //check for color and type differences


    const aX = this.force.x / this.mass;
    const aY = this.force.y / this.mass;
    const aZ = this.force.z / this.mass;

    this.velocity.x += aX;
    this.velocity.y += aY;
    this.velocity.z += aZ;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;

    //drag

    var dragX = 0.5 * DRAG * this.velocity.x * this.velocity.x;
    var dragY = 0.5 * DRAG * this.velocity.y * this.velocity.y;
    var dragZ = 0.5 * DRAG * this.velocity.z * this.velocity.z;

    if (this.velocity.x > 0) {
      this.force.x -= dragX;
    } else {
      this.force.x += dragX;
    }
    if (this.velocity.y > 0) {
      this.force.y -= dragY;
    } else {
      this.force.y += dragY;
    }
    if (this.velocity.z > 0) {
      this.force.z -= dragZ;
    } else {
      this.force.z += dragZ;
    }
    //jitter 
    this.force.x += (Math.random() - 0.5) * JITTER;
    this.force.y += (Math.random() - 0.5) * JITTER;
    this.force.z += (Math.random() - 0.5) * JITTER;

  }
}

function physics() {

}

function KrParticlesUpdate() {
  physics();
  octree.rebuild();
}

//TODO maybe add velocity and force random inputs?
function ksParticlesInit(particleNumber, particleinput, xMin, xMax, yMin, yMax, zMin, zMax) {
  for (i = 0; i < particleNumber; i++) {
    var newParticle = (particleinput.clone());
    newParticle.position.x = Math.random() * (xMax - xMin) + xMin;
    newParticle.position.y = Math.random() * (yMax - yMin) + yMin;
    newParticle.position.z = Math.random() * (zMax - zMin) + zMin;
    scene.add(newParticle); //ported to global name?
    octree.add(newParticle); //ported to global name?
    //octree.update();
  }
}