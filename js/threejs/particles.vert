attribute float size;

varying vec3 vColor;

void main(){
    
    vColor=color;
    
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    
    gl_PointSize=size*(300./-mvPosition.z);
    
    gl_Position=projectionMatrix*mvPosition;
    
}