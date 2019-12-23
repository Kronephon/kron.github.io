class Nebula_sp{
  constructor(){
    this.clock = new THREE.Clock();

    this.uniforms = {
      colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
      colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)},
      time:   {type: 'float', value: 2.0},
      randomFactor: {type: 'vec3', value: new THREE.Vector3(Math.random(),Math.random(),Math.random())}
    }

    this.geometry = new THREE.BoxGeometry(1,1,1);
    this.material =  new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: this.fragmentShader(),
      vertexShader: this.vertexShader(),
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = 2;

    scene_sp.add(this.mesh);

  }
  update(){
    this.uniforms.time.value = this.clock.getElapsedTime();
    this.uniforms.colorB.value.r = Math.random(); 
    this.uniforms.colorB.value.g = Math.random(); 
    this.uniforms.colorB.value.b = Math.random(); 
    this.mesh.rotation.x += (Math.random() - 0.5) * 0.05;
    this.mesh.rotation.y += (Math.random() - 0.5) * 0.05;
    this.mesh.rotation.z += (Math.random() - 0.5) * 0.05;
  }

  vertexShader() {
    return `
  varying vec3 vertexPos; 
  uniform vec3 randomFactor;
  uniform float time;
  
  void main() {
    vertexPos = position ; 
    vec4 modelViewPosition = modelViewMatrix * vec4(vertexPos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
  }
  `
  }
  
  fragmentShader() {
    return `
  uniform vec3 colorA; 
  uniform vec3 colorB; 
  varying vec3 vertexPos;
  
  void main() {
    gl_FragColor = vec4(colorB, 1.0);
  }
  `
  }
}
  