class KRParticle extends THREE.Mesh {
  constructor(param) {
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
    //this.motion();
    //TODO: add more dynamic color stuff here

    this.material.color.setHex(this.userData.color);

    this.life--;
  }
}