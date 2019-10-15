const pointMaterial =
    new THREE.PointsMaterial({
        color: 0xFFFFFF,
        opacity: 1.0,
        transparent: true
    });


class PointParticle extends THREE.Mesh{
    constructor(param){
        var geometry;
        if(param.hasOwnProperty('geometry')){
            geometry = pointSettings.geometry.clone();
        }else{
            geometry = new THREE.TetrahedronBufferGeometry(PARTICLESIZE);
        }

        var material;
        if(param.hasOwnProperty('material')){
            material = param['material'].clone();
        }else{
            material = new THREE.MeshLambertMaterial({
                color: 0xCC0000,
                transparency: true
            });
        }
        super(geometry, material);

        if(param.hasOwnProperty('position')){
            this.position.copy(param['position']);
        }

        for (var key in pointSettings) {
            if (this.hasOwnProperty(key)) {
                continue;
            } else {
                this.userData[key] = pointSettings[key];
                continue;
            }
        }
    }

}