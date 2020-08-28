precision mediump float;
attribute vec2 aPosition;
varying vec3 vColor;
uniform vec2 res;

void main()
{
    // vColor=vec3(1,1,1)/255.;
    vec2 circle=aPosition.xy/res*vec2(2,-2);
    gl_Position=vec4(circle,0,1);
    gl_PointSize=1.;
}

