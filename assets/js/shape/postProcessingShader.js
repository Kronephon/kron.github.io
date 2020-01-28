class postProcessingShader_sp{
    constructor(vertexShader, fragmentShader){
        this.uniforms = {
            tDiffuse:   {type: 'float', value: null },
            amount:     {type: 'float', value: 1.0 },
            windowsResolution: {type: 'vec2', value: renderer_sp.getSize()}  
        };
        console.log(renderer_sp.getSize());
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

}