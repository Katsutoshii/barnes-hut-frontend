import "../scss/App.scss";
import {
  Init,
  UpdateSimCount,
  UpdateStarCount,
  UpdatePause,
  UpdateOptimization,
} from "../threejs/particles";
import {
  DEF_NUM_STARS,
  DEF_NUM_SIMULATE,
  MAX_NUM_SIMULATE,
  MAX_NUM_STARS,
  DEF_PAUSE,
  DEF_OPTIMIZATION,
  Optimization,
} from "../common";
import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Button from "./Button";
import ButtonGroup from "./ButtonGroup";

type Props = { rustWasm };

export default function Home(props: Props) {
  const { rustWasm } = props;
  /* How many stars to simulate physics on */
  const [simulatedCount, setSimCount] = useState(DEF_NUM_SIMULATE);
  /* How many stars not included in simulation */
  const [starCount, setStarCount] = useState(DEF_NUM_STARS);

  /* Other controls */
  const [pauseSim, setPause] = useState(DEF_PAUSE);
  const [opt, setOpt] = useState<Optimization>(DEF_OPTIMIZATION);

  // On mount
  useEffect(() => {
    Init(rustWasm);
  }, []);

  useEffect(() => {
    UpdatePause(pauseSim);
  }, [pauseSim]);

  useEffect(() => {
    UpdateOptimization(opt);
  }, [opt]);

  useEffect(() => {
    UpdateSimCount(simulatedCount);
  }, [simulatedCount]);

  useEffect(() => {
    UpdateStarCount(starCount);
  }, [starCount]);

  return (
    <>
      <h1 className="header">
        Hi I'm a point cloud! Because I'm a point cloud, I think about
        Jojo's bum. Watashi mo, Pointu cloudu mo, jojo's bum ga thinku
        boutu a des.
      </h1>
      <form className="controls-container">
        <Button
          onClick={() => {
            setPause(!pauseSim);
          }}
        >
          {pauseSim ? "Play" : "Pause"}
        </Button>
        <ButtonGroup value={opt} onClick={(o) => setOpt(o)}>
          <Button groupLabel={Optimization.BarnesHut}>
            Barnes Hut
          </Button>
          <Button groupLabel={Optimization.Regular}>Regular</Button>
        </ButtonGroup>
        <Slider
          min={0}
          max={MAX_NUM_SIMULATE}
          value={simulatedCount}
          onChange={setSimCount}
          label="Particles"
        />
        <Slider
          min={0}
          max={MAX_NUM_STARS}
          value={starCount}
          onChange={setStarCount}
          label="Stars"
        />
      </form>
    </>
  );
}
