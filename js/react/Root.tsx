import "../scss/App.scss";
import ShaderView from "./main/ShaderView";

"use strict";

type Props = {
  array: Uint8Array;
};

function Root(props: Props) {
  const { array } = props;

  return (
    <div>
      <ShaderView array={array} />
    </div>
  );
}

module.exports = {
  Root,
};
