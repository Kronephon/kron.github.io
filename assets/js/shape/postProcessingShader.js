class postProcessingShader_sp{
    constructor(vertexShader, fragmentShader){
        this.uniforms = {
            time:   {type: 'float', value: 2.0}
        };

        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

}