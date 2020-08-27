precision highp float;
varying vec2 uv;
#define NUMMAX 1000000
uniform float xArray[NUMMAX];
uniform float yArray[NUMMAX];

void main(){
    gl_FragColor=xArray*vec4(uv.x,uv.y,1.,1.);
}