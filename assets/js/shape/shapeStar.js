class MainStar_sp{
  constructor(starVertexShader, starFragmentShader){
    this.clock = new THREE.Clock();

    this.uniforms = {
      //cameraPosition: {type: 'vec3', value: new THREE.Vector3(0,0,0)},
      colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
      colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)},
      time:   {type: 'float', value: 2.0},
      meshPosition: {type: 'vec4', value: new THREE.Vector3(0,0,0)}
    }

    this.geometry = new THREE.IcosahedronBufferGeometry(1.5, 4);
    this.material =  new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: starFragmentShader,
      vertexShader: starVertexShader,
      transparent: true
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material);
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
    this.uniforms.center = this.mesh.position;
    //this.uniforms.cameraPosition.value = camera_sp.position;
  }


  
  fragmentShader() {
    return `

  `
  }
}
  