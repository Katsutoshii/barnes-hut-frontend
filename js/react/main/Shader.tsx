import React from "react";
import { Shaders, Node } from "gl-react";
import { GLSL } from "gl-react";
import Particles from "../../shaders/Particles.glsl";

const shaders = Shaders.create({
  GLSL: {
    frag: GLSL`${Particles}`,
  },
});

type Props = {
  array: Uint8Array;
};

export default function Shader(props: Props) {
  const { array } = props;
  return <Node shader={shaders.GLSL} uniforms={{ array }} />;
}
