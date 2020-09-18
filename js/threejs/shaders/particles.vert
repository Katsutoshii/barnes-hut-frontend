uniform float height;
attribute float size;
varying vec3 vColor;
varying float vSizeFactor;
varying vec3 vPos;
void main(){
    vColor=color;
    
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    
    gl_PointSize=min(size*15.,height/3.5)*(300./-mvPosition.z);
    
    gl_Position=projectionMatrix*mvPosition;
    
    vSizeFactor=smoothstep(.5,8.,gl_PointSize/5.);
    vPos=position;
    
}