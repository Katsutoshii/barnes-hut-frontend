attribute float size;

varying float vSize;

void main(){
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    
    gl_PointSize=size*(300./-mvPosition.z);
    
    gl_Position=projectionMatrix*mvPosition;
    
    vSize=size;
}