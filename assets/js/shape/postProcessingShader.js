class postProcessingShader_sp{
    constructor(vertexShader, fragmentShader){
        this.uniforms = {
            tDiffuse:   {type: 'float', value: null },
            amount:     {type: 'float', value: 1.0 }      
        };

        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

}