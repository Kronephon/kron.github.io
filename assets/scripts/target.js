//class responsible for storing and giving information regarding the target mesh,
//idea is to have a quasy pointer system where we store indexes of connections. converting 
//to geometry for easier access, so it basically translates the mesh format from mesh centric
//to vertex centered

//expects a buffered geometry mesh

class KRTarget {
    constructor(parentMesh){
        console.log("KRTarget");
        this.parent = parentMesh;
        this.targetGeometry = (new THREE.Geometry()).fromBufferGeometry(parentMesh.geometry);
        this.targetGeometry.mergeVertices ();
        
        this.particleAssignments = {}; //map particle index. particleAssignments[particleID] = index

        this.vertexConnections = []; //index is vertex ID, content is array of connected indexes [[[a b][c f]]  [[f c][c d]] ], in which a b c f are all point indices
        
        this.unAssignedVertices = [];
        this.unAssignedVertices.length = this.targetGeometry.vertices.length;
        for(var i = 0; i<this.targetGeometry.vertices.length ; i++){ //deep copy of geometry vertices push/popping
            this.unAssignedVertices[i] = i;
        }

        this.vertexConnections.length = this.targetGeometry.vertices.length;
        for(var i = 0; i<this.targetGeometry.faces.length ; i++){ // convert to vertex centered perspective
            //assuming triangles!
            if((this.targetGeometry.faces[i]).hasOwnProperty('d')){ // hacking, connections are named a, b, c, d etc..
                console.log("KRTarget non triangle poligons detected, ignoring!");
                continue;
            }
            var a = (this.targetGeometry.faces[i])['a'];
            var b = (this.targetGeometry.faces[i])['b'];
            var c = (this.targetGeometry.faces[i])['c'];
            if(typeof this.vertexConnections[a] === 'undefined')
                this.vertexConnections[a] = [];
            this.vertexConnections[a].push([b, c]);
            
            if(typeof this.vertexConnections[b] === 'undefined')
                this.vertexConnections[b] = [];
            this.vertexConnections[b].push([a, c]);

            if(typeof this.vertexConnections[c] === 'undefined')
                this.vertexConnections[c] = [];
            this.vertexConnections[c].push([a, b]);
        

        }
    }

    targetsLeftToAssign(){
        return this.unAssignedVertices.length;
    }

    assignParticle(particle){
        var pick = Math.floor(Math.random()*(this.unAssignedVertices.length)); //let's do random for now
        var vertexAssignment = this.unAssignedVertices[pick];
        this.unAssignedVertices.splice(pick, 1); // slow!
        
        particle.setTarget(this.getCoordsFromIndex(vertexAssignment));
        
        this.particleAssignments[particle.uuid] = vertexAssignment;
    }

    removeParticle(particle){

    }

    getCoordsFromIndex(index){
        return new THREE.Vector3().copy(this.targetGeometry.vertices[index].applyMatrix4(this.parent.matrix));
    }
   
    getConnectedParticles(particle){ // returns only assigned particles
        var vertex = this.particleAssignments[particle.uuid];
        var connected = this.vertexConnections[vertex];
        var connectedParticles = [];
        for (var i = 0; i < connected.length; i++){
            pointB = 
            pointC = 
        }
    }

}