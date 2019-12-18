// class responsible for background stars
const NUMBER_OF_STARS_SP = 1000000;
const ZBACK_SP = -500;

class Stars_sp{
    constructor(){
        var geometry = new THREE.BufferGeometry();
        var vertices = new Float32Array(NUMBER_OF_STARS_SP * 3);
        var x = 1000;
        var y = 1000;
        for(var i= 0; i<NUMBER_OF_STARS_SP*3; i = i + 3){
            vertices[i] = (Math.random() - 0.5)*x;
            vertices[i+1] = (Math.random() - 0.5)*y;
            vertices[i+2] = ZBACK_SP;
        }
        
        console.log(vertices);
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        this.map = new THREE.Points(geometry);
        scene_sp.add(this.map);

    }
}