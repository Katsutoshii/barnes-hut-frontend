import React, { useState } from "react";
import Button from "./inputs/Button";

function About() {
  const [isShown, setShown] = useState(false);
  return (
    <>
      <Button onClick={() => setShown(!isShown)} className="about h3">
        About
      </Button>
      <div
        className={[
          "about-panel upper",
          isShown ? "shown" : "hidden",
        ].join(" ")}
      >
        About!!!!
      </div>
    </>
  );
}

export default About;
