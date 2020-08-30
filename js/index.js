import ReactDOM from "react-dom";
import Root from "./react/Root";
import "./threejs/particles";

const NUM_PARTICLES = 5;
const DIMENSION = 3;

import("../pkg/index.js")
  .then((rustWasm) => {
    console.log(rustWasm);
    console.log("TessBot");

    // Initialize arrays in JS
    const r = new Float32Array(NUM_PARTICLES * DIMENSION);
    const v = new Float32Array(NUM_PARTICLES * DIMENSION);
    const a = new Float32Array(NUM_PARTICLES * DIMENSION);
    const m = new Float32Array(NUM_PARTICLES);

    // Assign the rust simulation's pointers to point to these arrays
    rustWasm.init_simulation(r, v, a, m);

    console.log("r", r);

    ReactDOM.render(
      React.createElement(Root, {}),
      document.getElementById("root")
    );
  })
  .catch(console.error);
