

class krParticle extends THREE.Mesh { // perhaps look into making it into a point? 
    constructor(mesh, material, x,y,z,mass, vx, vy, vz, fx,fy,fz, colorHex, life, size) {
        super(mesh, material);

        this.mass = mass;
        this.velocity = new THREE.Vector3( vx, vy, vz );
        this.force = new THREE.Vector3( fx, fy, fz );
        this.color = colorHex;
        this.life = life; //-1 for don't die
        this.size = size;
        this.position.x = x;
        console.log(this.position.x);
        console.log(x);
        this.position.y = y;
        this.position.z = z;

        this.JITTER = 0.002;
        this.DRAG = 0.06;

    }

    clone() {
        var mesh = super.clone();
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;
        var mass = this.mass;
        var fx = this.force.x;
        var fy = this.force.y;
        var fz = this.force.z;
        var vx = this.velocity.x;
        var vy = this.velocity.y;
        var vz = this.velocity.z;
        var size = this.size;
        var life = this.life;
        var color = this.color;
        var clonedParticle = new krParticle(mesh.geometry, mesh.material, this.position.x, this.position.y, this.position.z, mass, vx, vy, vz, fx, fy, fz, color, life, size);
        console.log("particle cloned with" + clonedParticle.position.x);
        return clonedParticle;
    }

    process(){
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
  
      var dragX = 0.5 * this.DRAG * this.velocity.x * this.velocity.x;
      var dragY = 0.5 * this.DRAG * this.velocity.y * this.velocity.y;
      var dragZ = 0.5 * this.DRAG * this.velocity.z * this.velocity.z;
  
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
      this.force.x += (Math.random() - 0.5) * this.JITTER;
      this.force.y += (Math.random() - 0.5) * this.JITTER;
      this.force.z += (Math.random() - 0.5) * this.JITTER;

    }
}

function physics(){
    (octree.search(new THREE.Vector3(0,0,0), 3000 )).forEach(function(element) {
       element.object.process();//element.process();
       //console.log(element.object.position.x);
       //throw new Error("Something went badly wrong!");
    });
}

function KrParticlesUpdate(){
    physics();
    octree.rebuild();
}

//TODO maybe add velocity and force random inputs?
function ksParticlesInit(particleNumber, particleinput, xMin, xMax, yMin, yMax, zMin, zMax){
    for(i = 0; i < particleNumber ;i++){
        var newParticle = (particleinput.clone());
        newParticle.position.x = Math.random()*(xMax-xMin) + xMin;
        newParticle.position.y = Math.random()*(yMax-yMin) + yMin;
        newParticle.position.z = Math.random()*(zMax-zMin) + zMin;
        scene.add(newParticle);     //ported to global name?
        octree.add(newParticle); //ported to global name?
        octree.update();
    }
}