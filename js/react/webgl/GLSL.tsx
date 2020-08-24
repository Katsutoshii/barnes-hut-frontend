import { GLSL } from "gl-react";

const Shader1 = {
  frag: GLSL`
  precision highp float;
  varying vec2 uv;
  uniform vec4 array;
  void main() {
    gl_FragColor = array * vec4(uv.x, uv.y, 1.0, 1.0);
  }`,
};

export default Shader1;
