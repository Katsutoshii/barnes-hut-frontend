precision highp float;
varying vec2 uv;
uniform vec4 array;
void main(){
    gl_FragColor=array*vec4(uv.x,uv.y,1.,1.);
}