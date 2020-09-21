import React, { Suspense, useEffect, useState } from "react";
import "../scss/App.scss";
import ErrorBoundary from "./ErrorBoundary";
import Controls from "./Controls";
import About from "./About";
import Credits from "./Credits";
import ShimmerText from "./ShimmerText";
import { hideOnClickGalaxy } from "../utils/NotificationUtil";
import Loading from "./Loading";

type Props = { rustWasm };

export default function Root(props: Props) {
  const [loaded, setLoaded] = useState(false);
  const id = "black-hole-notif";
  /* on mount, listen for creating new black hole/click,
  then remove notification accordingly */
  useEffect(() => {
    hideOnClickGalaxy(id);
    setLoaded(true);
  }, []);

  return (
    <ErrorBoundary>
      <About />
      <ShimmerText id={id} className="upper notification">
        Click to create black hole
      </ShimmerText>
      <Controls {...props} />
      <Credits />
      <Loading loaded={loaded} />
    </ErrorBoundary>
  );
}
