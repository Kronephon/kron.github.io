class KRParticle extends THREE.Mesh {
  constructor(param) { //takes a set of parameters, some might be mandatory check below
    super();
  }

  loadSettings(param) {
    if (typeof param === 'undefined') {
      console.log("KRParticle loadSettings param undefined.")
      return;
    }
    //console.log("Creating new KRParticle type");
    for (var key in param) {
      if (this.hasOwnProperty(key)) {
        if (key == "position") {
          this.position.x = param[key].x;
          this.position.y = param[key].y;
          this.position.z = param[key].z;
          //console.log(key + " -> " + this[key]);
        } else {
          this[key] = param[key];
          //console.log(key + " -> " + this[key]);
        }
      } else {
        this.userData[key] = param[key];
        //console.log(key + " [userData]-> " + this.userData[key]);
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
    if (typeof this.userData.mass === 'undefined') {
      console.log("KRParticle process: " + this.userData.name + " has no mass.");
      return;
    }

    //jitter 
    this.userData.force.x = (Math.random() - 0.5) * JITTER;
    this.userData.force.y = (Math.random() - 0.5) * JITTER;
    this.userData.force.z = (Math.random() - 0.5) * JITTER;
    //drag

    var dragX = 0.5 * DRAG * this.userData.velocity.x * this.userData.velocity.x;
    var dragY = 0.5 * DRAG * this.userData.velocity.y * this.userData.velocity.y;
    var dragZ = 0.5 * DRAG * this.userData.velocity.z * this.userData.velocity.z;

    if (this.userData.velocity.x > 0) {
      this.userData.force.x -= dragX;
    } else {
      this.userData.force.x += dragX;
    }
    if (this.userData.velocity.y > 0) {
      this.userData.force.y -= dragY;
    } else {
      this.userData.force.y += dragY;
    }
    if (this.userData.velocity.z > 0) {
      this.userData.force.z -= dragZ;
    } else {
      this.userData.force.z += dragZ;
    }

    const aX = this.userData.force.x / this.userData.mass;
    const aY = this.userData.force.y / this.userData.mass;
    const aZ = this.userData.force.z / this.userData.mass;

    this.userData.velocity.x += aX;
    this.userData.velocity.y += aY;
    this.userData.velocity.z += aZ;

    this.position.x += this.userData.velocity.x;
    this.position.y += this.userData.velocity.y;
    this.position.z += this.userData.velocity.z;
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