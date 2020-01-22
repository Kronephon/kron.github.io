class VolumetricNebula_sp {
    constructor(vertexShader, fragmentShader) {
        this.clock = new THREE.Clock();
        this.uniforms = {
            time: {
                type: 'float',
                value: 2.25
            },
            maxX: {
                type: 'float',
                value: 2.25
            },
            maxY: {
                type: 'float',
                value: 2.25
            },  
            maxZ: {
                type: 'float',
                value: 2.25
            },
            minX: {
                type: 'float',
                value: -2.25
            },
            minY: {
                type: 'float',
                value: -2.25
            },
            minZ: {
                type: 'float',
                value: -2.25
            },
            lightCoord: {
                type: 'v3',
                value: [0,0,0]
            }

        }

        this.geometry = new THREE.BoxBufferGeometry(4.5, 4.5, 4.5, 1, 1, 1); // width, height, depth

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            transparent: true
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene_sp.add(this.mesh);
    }
    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
        //this.mesh.rotation.x += 0.01;
        //this.mesh.rotation.y += 0.01;
        //this.mesh.rotation.z += 0.01;
    }
}