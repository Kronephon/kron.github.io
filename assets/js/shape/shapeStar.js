class MainStar_sp{
  constructor(starVertexShader, starFragmentShader){
    this.clock = new THREE.Clock();

    this.uniforms = {
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
    console.log(this.mesh);
  }
  update(){
    this.uniforms.time.value = this.clock.getElapsedTime();
    this.mesh.rotation.x += (Math.random() - 0.15) * 0.01;
    this.mesh.rotation.y += (Math.random() - 0.25) * 0.01;
    this.mesh.rotation.z += (Math.random() - 0.5) * 0.01;
    this.uniforms.center = this.mesh.position;
    //this.uniforms.cameraPosition.value = camera_sp.position;
  }
}
  