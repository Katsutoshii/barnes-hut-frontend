import React from "react";

type Props = {
  loaded: boolean;
};
function Loading(props: Props) {
  const { loaded } = props;
  return (
    <div className={["loading", loaded ? "loaded" : ""].join(" ")}>
      <div className="spinner-box">
        <div className="circle-border">
          <div className="circle-core"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
