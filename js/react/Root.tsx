import React, { Suspense, useEffect, useState } from "react";
import "../scss/App.scss";
import ErrorBoundary from "./ErrorBoundary";
import Controls from "./Controls";
import About from "./About";
import Credits from "./Credits";
import Loading from "./Loading";

type Props = { rustWasm };

export default function Root(props: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <ErrorBoundary>
      <About />
      <Controls {...props} />
      <Credits />
      <Loading loaded={loaded} />
    </ErrorBoundary>
  );
}
