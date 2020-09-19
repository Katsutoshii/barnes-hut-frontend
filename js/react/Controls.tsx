import "../scss/App.scss";
import {
  init,
  setSimCount,
  setStarCount,
  setPause,
  setOptimization,
  setDT,
  setTheta,
} from "../threejs/particles";
import { initStats } from "../utils/statsUtil";
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
  DEF_DT,
  DEF_THETA,
  MAX_DT,
  MAX_THETA,
  MIN_DT,
  MIN_THETA,
} from "../common";
import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Button from "./Button";
import ButtonGroup from "./ButtonGroup";

type Props = { rustWasm };

export default function Controls(props: Props) {
  const { rustWasm } = props;
  /* How many stars to simulate physics on */
  const [simulatedCount, sSimC] = useState(DEF_NUM_SIMULATE);
  /* How many stars not included in simulation */
  const [starCount, sStarC] = useState(DEF_NUM_STARS);

  /* Other controls */
  const [pauseSim, sP] = useState(DEF_PAUSE);
  const [opt, setOpt] = useState<Optimization>(DEF_OPTIMIZATION);
  const [theta, sT] = useState(DEF_THETA);
  const [dT, sDT] = useState(DEF_DT);

  // On mount
  useEffect(() => {
    init(rustWasm);
    initStats();
  }, []);

  useEffect(() => {
    setPause(pauseSim);
  }, [pauseSim]);

  useEffect(() => {
    setOptimization(opt);
  }, [opt]);

  useEffect(() => {
    setSimCount(simulatedCount);
  }, [simulatedCount]);

  useEffect(() => {
    setTheta(theta);
  }, [theta]);

  useEffect(() => {
    setDT(dT);
  }, [dT]);

  useEffect(() => {
    setStarCount(starCount);
  }, [starCount]);

  return (
    <>
      <h1 className="header">Click to create black hole</h1>
      <form className="controls-container">
        <Button
          onClick={() => {
            sP(!pauseSim);
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
                sSimC(
                  clamp(simulatedCount, 0, MAX_NUM_BARNES_SIMULATE)
                );
                break;
              case Optimization.Direct:
                sSimC(
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
          onChange={sSimC}
          label="Particles"
        />
        <Slider
          min={MIN_THETA}
          max={MAX_THETA}
          value={theta}
          onChange={sT}
          label="Theta"
        />
        <Slider
          min={MIN_DT}
          max={MAX_DT}
          value={dT}
          onChange={sDT}
          label="Delta Time"
        />
        <Slider
          min={0}
          max={MAX_NUM_STARS}
          value={starCount}
          onChange={sStarC}
          label="Stars"
        />
      </form>
    </>
  );
}
