precision highp float;
varying vec2 uv;
uniform vec4 xArray;
uniform vec4 yArray;
void main(){
    gl_FragColor=xArray*vec4(uv.x,uv.y,1.,1.);
}