import React from "react";
import { Shaders, Node } from "gl-react";
import GLSL from "../webgl/GLSL";

const shaders = Shaders.create({
  GLSL,
});

type Props = {
  array: Uint8Array;
};

export default function Shader(props: Props) {
  const { array } = props;
  return <Node shader={shaders.GLSL} uniforms={{ array }} />;
}
