varying float angle;
  
  void main() {
    if(angle <= 0.50){
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }else{
      gl_FragColor = vec4(angle, angle, angle, 1.0);
    }
 }