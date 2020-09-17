varying vec3 vColor;

void main(){
    if(length(gl_PointCoord-vec2(.5,.5))>.475)discard;
    
    gl_FragColor=vec4(vColor,1.);
}