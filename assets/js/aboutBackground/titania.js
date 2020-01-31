class titania_sp {
    constructor(vertexShader, fragmentShader, scene) {
        this.clock = new THREE.Clock();
        this.geometry = this.geometry = new THREE.BoxBufferGeometry(8.0, 8.0, 8.0, 1, 1, 1); // width, height, depth;
        this.geometry.computeBoundingBox();
        this.uniforms = {
            time: { type: 'float', value: 2.0 },

            minX: { type: 'float', value: this.geometry.boundingBox.min.x },
            minY: { type: 'float', value: this.geometry.boundingBox.min.y },
            minZ: { type: 'float', value: this.geometry.boundingBox.min.z },
            maxX: { type: 'float', value: this.geometry.boundingBox.max.x },
            maxY: { type: 'float', value: this.geometry.boundingBox.max.y },
            maxZ: { type: 'float', value: this.geometry.boundingBox.max.z },

            radius: { type: 'float', value: 1.0 },

            starColor: { type: 'vec3', value: new THREE.Vector3(0.9, 0.7, 0.9) },

            starEdgeColor: { type: 'vec3', value: new THREE.Vector3(0.2, 0.6, 1.0) },

            starEmission: { type: 'vec3', value: new THREE.Vector3(0.8, 0.6, 1.0) },

            starRotationSpeed: { type: 'float', value: 0.4 },

            meshPosition: { type: 'vec4', value: new THREE.Vector3(0, 0, 0) }
        }


        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
            transparent: true,
            side: THREE.DoubleSide
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
    }
    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
        this.uniforms.center = this.mesh.position; // todo add random to emission color
    }
}