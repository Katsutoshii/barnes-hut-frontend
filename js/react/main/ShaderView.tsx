import React from "react";
import { Surface } from "gl-react-dom"; // for React DOM
import ErrorBoundary from "./../utils/ErrorBoundary";
import Shader from "./Shader";

type Props = {
  array: Uint8Array;
};

function ShaderView(props: Props) {
  const { array } = props;
  return (
    <div className="container">
      <div>Input: {array.join(",")}</div>
      <ErrorBoundary>
        <Surface width={300} height={300}>
          <Shader array={array} />
        </Surface>
      </ErrorBoundary>
    </div>
  );
}

export default ShaderView;
