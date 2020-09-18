uniform float time;
attribute float size;
attribute float p;

varying float vSize;
varying float vP;

void main(){
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    
    gl_PointSize=size*30.*(300./-mvPosition.z);
    
    gl_Position=projectionMatrix*mvPosition;
    
    vSize=size;
    vP=p;
}