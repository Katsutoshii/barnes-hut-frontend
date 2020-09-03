import "../scss/App.scss";
import {
  Init,
  UpdateSimCount,
  UpdateStarCount,
  DEF_NUM_STARS,
  DEF_NUM_SIMULATE,
  MAX_NUM_SIMULATE,
  MAX_NUM_STARS,
  DEF_PAUSE,
  UpdatePause,
} from "../threejs/particles";
import { useState, useEffect } from "react";
import Slider from "./Slider";
import PauseButton from "./PauseButton";
import ErrorBoundary from "./ErrorBoundary";

type Props = { rustWasm };

export default function Home(props: Props) {
  const { rustWasm } = props;
  const [pauseSim, setPause] = useState(DEF_PAUSE);
  const [simulatedCount, setSimCount] = useState(DEF_NUM_SIMULATE);

  /* How many stars not included in simulation */
  const [starCount, setStarCount] = useState(DEF_NUM_STARS);

  // On mount
  useEffect(() => {
    Init(rustWasm);
  }, []);

  useEffect(() => {
    UpdatePause(pauseSim);
  }, [pauseSim]);

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
        <PauseButton paused={pauseSim} OnToggle={setPause} />
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
