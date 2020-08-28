import React, { useEffect } from "react";
import { Surface } from "gl-react-dom"; // for React DOM
import ErrorBoundary from "../utils/ErrorBoundary";
import ParticleShader from "./ParticleShader";

type Props = {};

function ShaderView(props: Props) {
  useEffect(() => {
    ParticleShader();
  }, []);
  return (
    <div className="container">
      <ErrorBoundary>
        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
        ></canvas>
      </ErrorBoundary>
    </div>
  );
}

export default ShaderView;
