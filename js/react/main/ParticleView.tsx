import React from "react";
import { Surface } from "gl-react-dom"; // for React DOM
import ErrorBoundary from "../utils/ErrorBoundary";
import ParticleShader from "./ParticleShader";

type Props = {
  xArray: Uint8Array;
  yArray: Uint8Array;
};

function ShaderView(props: Props) {
  const { xArray, yArray } = props;
  return (
    <div className="container">
      <div>X Pos: {xArray.join(",")}</div>
      <div>Y Pos: {yArray.join(",")}</div>
      <ErrorBoundary>
        <Surface width={300} height={300}>
          <ParticleShader xArray={xArray} yArray={yArray} />
        </Surface>
      </ErrorBoundary>
    </div>
  );
}

export default ShaderView;
