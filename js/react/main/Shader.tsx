import React from "react";
import { Shaders, Node } from "gl-react";
import { GLSL } from "gl-react";
// import Particles from "raw-loader!glslify-loader!./shaders/Particles.glsl";

const shaders = Shaders.create({
  GLSL: {
    frag: GLSL`
    precision highp float;
    varying vec2 uv;
    uniform vec4 array;
    void main() {
      gl_FragColor = array * vec4(uv.x, uv.y, 1.0, 1.0);
    }`,
  },
});

type Props = {
  array: Uint8Array;
};

export default function Shader(props: Props) {
  const { array } = props;
  return <Node shader={shaders.GLSL} uniforms={{ array }} />;
}
