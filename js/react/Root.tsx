import React, { Suspense } from "react";
import "../scss/App.scss";
import ErrorBoundary from "./ErrorBoundary";
import Controls from "./Controls";
import About from "./About";
import Credits from "./Credits";

type Props = { rustWasm };

export default function Root(props: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <About />
        <Controls {...props} />
        <Credits />
      </Suspense>
    </ErrorBoundary>
  );
}
