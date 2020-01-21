class VolumetricNebula_sp {
    constructor(vertexShader, fragmentShader) {
        this.clock = new THREE.Clock();
        this.uniforms = {
            time: {
                type: 'float',
                value: 2.0
            },
            maxX: {
                type: 'float',
                value: 2.0
            },
            maxY: {
                type: 'float',
                value: 2.0
            },  
            maxZ: {
                type: 'float',
                value: 2.0
            },
            minX: {
                type: 'float',
                value: -2.0
            },
            minY: {
                type: 'float',
                value: -2.0
            },
            minZ: {
                type: 'float',
                value: -2.0
            }

        }

        this.geometry = new THREE.BoxBufferGeometry(4.0, 4.0, 4.0, 20, 20, 20); // width, height, depth

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            transparent: true
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene_sp.add(this.mesh);
        console.log(this.mesh);
    }
    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.01;
        //this.mesh.rotation.z += 0.01;
    }
}