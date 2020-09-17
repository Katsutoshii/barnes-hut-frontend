varying float vSize;

uniform vec3 color;

vec3 hueShift(vec3 color,float hue)
{
    const vec3 k=vec3(.57735,.57735,.57735);
    float cosAngle=cos(hue);
    return vec3(color*cosAngle+cross(k,color)*sin(hue)+k*dot(k,color)*(1.-cosAngle));
}

void main(){
    
    if(length(gl_PointCoord-vec2(.5,.5))>.475)discard;
    
    vec4 colorA=vec4(color,1.);
    vec4 colorB=vec4(hueShift(color,2.),1.);
    
    // change hue based on scale
    // u - x where x should be at least the amount added when randomizing starM in particles.ts
    float pct=clamp((vSize-2.4)/4.,0.,1.);
    gl_FragColor=mix(colorA,colorB,pct);
}