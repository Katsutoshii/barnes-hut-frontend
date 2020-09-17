import "../scss/App.scss";
import {
  init,
  updateSimCount,
  updateStarCount,
  updatePause,
  updateOptimization,
} from "../threejs/particles";
import {
  DEF_NUM_STARS,
  DEF_NUM_SIMULATE,
  MAX_NUM_DIRECT_SIMULATE,
  MAX_NUM_BARNES_SIMULATE,
  MAX_NUM_STARS,
  DEF_PAUSE,
  DEF_OPTIMIZATION,
  Optimization,
  clamp,
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
    init(rustWasm);
  }, []);

  useEffect(() => {
    updatePause(pauseSim);
  }, [pauseSim]);

  useEffect(() => {
    updateOptimization(opt);
  }, [opt]);

  useEffect(() => {
    updateSimCount(simulatedCount);
  }, [simulatedCount]);

  useEffect(() => {
    updateStarCount(starCount);
  }, [starCount]);

  return (
    <>
      <h1 className="header">Click to create black hole</h1>
      <form className="controls-container">
        <Button
          onClick={() => {
            setPause(!pauseSim);
          }}
        >
          {pauseSim ? "Play" : "Pause"}
        </Button>
        <ButtonGroup
          value={opt}
          onClick={(o) => {
            setOpt(o);
            switch (o) {
              case Optimization.BarnesHut:
                setSimCount(
                  clamp(simulatedCount, 0, MAX_NUM_BARNES_SIMULATE)
                );
                break;
              case Optimization.Direct:
                setSimCount(
                  clamp(simulatedCount, 0, MAX_NUM_DIRECT_SIMULATE)
                );
                break;
            }
          }}
        >
          <Button groupLabel={Optimization.BarnesHut}>
            Barnes Hut
          </Button>
          <Button groupLabel={Optimization.Direct}>Direct</Button>
        </ButtonGroup>
        <Slider
          min={0}
          max={
            opt == Optimization.BarnesHut
              ? MAX_NUM_BARNES_SIMULATE
              : MAX_NUM_DIRECT_SIMULATE
          }
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
