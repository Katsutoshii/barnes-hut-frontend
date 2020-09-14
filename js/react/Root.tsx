import React from "react";
import "../scss/App.scss";
import ErrorBoundary from "./ErrorBoundary";
import Home from "./Home";

type Props = { rustWasm };

export default function Root(props: Props) {
  return (
    <ErrorBoundary>
      <Home {...props} />
    </ErrorBoundary>
  );
}
