import React, { Suspense } from "react";
import "../scss/App.scss";
import ErrorBoundary from "./ErrorBoundary";
import Controls from "./Controls";

type Props = { rustWasm };

export default function Root(props: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Controls {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
