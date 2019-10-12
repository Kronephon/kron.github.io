

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
        this.position.y = y;
        this.position.z = z;

        this.JITTER = 0.5;
        this.DRAG = 0.3;

    }
    motion(){
      const aX = particle.force.x / particle.mass;
      const aY = particle.force.y / particle.mass;
      const aZ = particle.force.z / particle.mass;
  
      particle.velocity.x += aX;
      particle.velocity.y += aY;
      particle.velocity.z += aZ;
  
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;
  
      //drag
  
      dragX = 0.5 * DRAG * particle.velocity.x * particle.velocity.x;
      dragY = 0.5 * DRAG * particle.velocity.y * particle.velocity.y;
      dragZ = 0.5 * DRAG * particle.velocity.z * particle.velocity.z;
  
      if (particle.velocity.x > 0) {
          particle.force.x -= dragX;
      } else {
          particle.force.x += dragX;
      }
      if (particle.velocity.y > 0) {
          particle.force.y -= dragY;
      } else {
          particle.force.y += dragY;
      }
      if (particle.velocity.z > 0) {
          particle.force.z -= dragZ;
      } else {
          particle.force.z += dragZ;
      }
      //jitter 
      particle.force.x += (Math.random() - 0.5) * JITTER;
      particle.force.y += (Math.random() - 0.5) * JITTER;
      particle.force.z += (Math.random() - 0.5) * JITTER;

    }
}

function physics(){
    octree.search(new THREE.Vector3(0,0,0), 10000000000000 );
}

function KrParticlesUpdate(){
    physics();
    octree.rebuild();
}

//outStruct must have a save method
//TODO maybe add velocity and force random inputs?
function ksParticlesInit(particleNumber, particle, xMin, xMax, yMin, yMax, zMin, zMax){
    for(i = 0; i < particleNumber ;i++){
        var newParticle = particle.clone();
        newParticle.position.x = Math.random()*(xMax-xMin) + xMin;
        newParticle.position.y = Math.random()*(yMax-yMin) + yMin;
        newParticle.position.z = Math.random()*(zMax-zMin) + zMin;
        scene.add(newParticle);     //ported to global name?
        octree.add(newParticle, { useVertices: true } ); //ported to global name?
        octree.update();
    }
}


var particle = new krParticle(10,0,0, 10, 0,0,0, 0,0,0, 0xFFFFFF, 10, 10);