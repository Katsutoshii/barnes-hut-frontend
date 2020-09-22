precision highp float;

uniform float uProgress;
uniform float uPower;

uniform bool uOut;

vec4 transparent=vec4(0.,0.,0.,0.);
vec4 black=vec4(0.,0.,0.,1.);

#define M_PI 3.1415926535897932384626433832795

varying vec2 vUv;

void main(){
    vec2 uv=vUv;
    
    uv.y-=((sin(uv.x*M_PI)*uPower)*.25);
    
    if(!uOut)uv.y=1.-uv.y;
    
    float t=smoothstep(uv.y-fwidth(uv.y),uv.y,uProgress);
    vec4 color=mix(transparent,black,t);
    
    gl_FragColor=color;
}