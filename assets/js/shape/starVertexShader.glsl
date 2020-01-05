  varying vec3 vertexPos; 
  varying float angle;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec4 center2 = projectionMatrix * modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec3 NinView  = normalize(normalMatrix * normal);
    
    vec4 posInView = modelViewMatrix * vec4(position, 1.0);
    posInView /= posInView[3];
    vec3 VinView = normalize(-posInView.xyz); 
    angle = dot(NinView , VinView);
  }