uniform float time;
varying vec3 vColor;
varying float vSizeFactor;
varying vec3 vPos;

vec2 random2(vec2 st){
    st=vec2(dot(st,vec2(127.1,311.7)),
    dot(st,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    
    vec2 u=f*f*(3.-2.*f);
    
    return mix(mix(dot(random2(i+vec2(0.,0.)),f-vec2(0.,0.)),
    dot(random2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
    mix(dot(random2(i+vec2(0.,1.)),f-vec2(0.,1.)),
    dot(random2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);
}

void main(){
    // // if within circle, return color
    vec2 center=gl_PointCoord-vec2(.5,.5);
    float dist=length(center);
    
    float step1=0.;
    float step2=.33;
    
    float w=smoothstep(step2,step1,dist);
    
    float threshold=.9;

    float t = time + vPos.x + vPos.y;

    float n=noise(center*2.+t);
    
    if(vColor.r<.5){
        w*=10.;
        if(w>threshold){
            // get animation on black hole
            float a=w*n;
            gl_FragColor=vec4(vColor,max(.5,threshold+a/3.));
        }
        else{
            // get animation on black hole's rim
            vec3 white=vec3(1.,1.,1.);
            float n=noise(center*3.+t*5.);
            gl_FragColor=vec4(white,min(w+w*n*2.,1.));
        }
    }else{
        float glow=w>threshold?1.:min(w/2.,threshold/2.)*max(.2,sin(t*5.*vSizeFactor));
        gl_FragColor=vec4(vColor,glow);
    }
}