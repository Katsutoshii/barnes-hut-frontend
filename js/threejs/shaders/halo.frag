precision highp float;
uniform float max;
varying vec3 vPosition;

// Gradient noise from Jorge Jimenez's presentation:
// http://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare
float gradientNoise(in vec2 uv)
{
    const vec3 magic = vec3(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(uv, magic.xy)));
}

void main() {
  float d = clamp(1.-length(vPosition)/max,0.,1.);
  gl_FragColor = vec4(1.,1.,1.,smoothstep(0., 4.,d));
  // apply noise to reduce color banding
  gl_FragColor += (1.0/255.0) * gradientNoise(vec2(vPosition.x, vPosition.y))- (0.5/255.0);
}