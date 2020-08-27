import React from "react";
import { Shaders, Node } from "gl-react";
import { GLSL } from "gl-react";
import Fragment from "../../shaders/Particles.frag";
// import Vert from "../../shaders/Particles.vert";

const shaders = Shaders.create({
  Particles: {
    frag: GLSL`${Fragment}`,
    // vert: GLSL`${Vert}`,
  },
});

type Props = {
  xArray: Uint8Array;
  yArray: Uint8Array;
};

export default function Shader(props: Props) {
  return <Node shader={shaders.Particles} uniforms={{ ...props }} />;
}
