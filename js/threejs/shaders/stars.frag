uniform float time;
uniform vec3 color;

varying float vSize;
varying float vP;

vec3 hueShift(vec3 color,float hue)
{
    const vec3 k=vec3(.57735,.57735,.57735);
    float cosAngle=cos(hue);
    return vec3(color*cosAngle+cross(k,color)*sin(hue)+k*dot(k,color)*(1.-cosAngle));
}

void main(){
    vec3 colorB=hueShift(color,2.);
    
    // change hue based on scale
    // u - x where x should be at least the amount added when randomizing starM in particles.ts
    float pct=clamp((vSize-2.6)/5.,0.,1.);
    vec3 vColor=mix(color,colorB,pct);
    
    // // if within circle, return color
    vec2 center = abs(gl_PointCoord-vec2(.5,.5));
    float dist = pow(pow(center.x, vP) + pow(center.y, vP),1./vP);
    
    float step1=0.;
    float step2=.18;
    
    float w=smoothstep(step2,step1,dist);
    
    float threshold=.92;
    
    float glow=w>threshold?1.:min(w/3.,threshold/3.5)*max(.2,sin(time*vSize));
    gl_FragColor=vec4(vColor,glow);
}