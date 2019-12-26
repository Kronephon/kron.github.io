class Nebula_sp{
  constructor(){
    this.clock = new THREE.Clock();

    this.uniforms = {
      //cameraPosition: {type: 'vec3', value: new THREE.Vector3(0,0,0)},
      colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
      colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)},
      time:   {type: 'float', value: 2.0},
      randomFactor: {type: 'vec3', value: new THREE.Vector3(Math.random(),Math.random(),Math.random())}
    }

    this.geometry = new THREE.SphereGeometry(1, 200, 200);
    this.material =  new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: this.fragmentShader(),
      vertexShader: this.vertexShader()
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = 3;
    scene_sp.add(this.mesh);

  }
  update(){
    this.uniforms.time.value = this.clock.getElapsedTime();
    this.uniforms.colorB.value.r = Math.random(); 
    this.uniforms.colorB.value.g = Math.random(); 
    this.uniforms.colorB.value.b = Math.random(); 
    this.mesh.rotation.x += (Math.random() - 0.15) * 0.05;
    this.mesh.rotation.y += (Math.random() - 0.25) * 0.05;
    this.mesh.rotation.z += (Math.random() - 0.5) * 0.05;
    //this.uniforms.cameraPosition.value = camera_sp.position;
  }

  vertexShader() {
    return `
  varying vec3 vertexPos; 
  varying float angle;
  
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 NinView  = normalize(normalMatrix * normal);
    
    vec4 posInView = modelViewMatrix * vec4(position, 1.0);
    posInView /= posInView[3];
    vec3 VinView = normalize(-posInView.xyz); 
    angle = dot(NinView , VinView);
    if(angle > 0.7){
      angle = 1.0;
    }else{
      angle = 0.0;
    } 
  }
  `
  }
  
  fragmentShader() {
    return `
  uniform vec3 colorA; 
  uniform vec3 colorB; 
  
  varying vec3 norm;
  varying vec3 vertexPos;
  varying float angle;
  
  void main() {
    gl_FragColor = vec4(angle, angle, angle, 1.0);
  }
  `
  }
}
  