class VolumetricNebula_sp {
    constructor(vertexShader, fragmentShader) {
        this.clock = new THREE.Clock();

        this.uniforms = {
            time: {
                type: 'float',
                value: 2.0
            }
        }

        //since this is to generate a volume, a cube is a fast way to describe the bounding box volume
        this.geometry = new THREE.BoxBufferGeometry(4.0, 4.0, 3.0); // width, height, depth

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: starFragmentShader,
            vertexShader: starVertexShader,
            transparent: true
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene_sp.add(this.mesh);
        console.log(this.mesh);
    }
    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
        this.uniforms.center = this.mesh.position;
    }
}