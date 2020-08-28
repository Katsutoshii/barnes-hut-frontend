import ReactDOM from "react-dom";
import Root from "./react/Root";
import "./threejs/particles";

import("../pkg/index.js")
  .then((rustWasm) => {
    console.log(rustWasm);

    // Initialize arrays in JS
    const rx = new Float32Array(5);
    const ry = new Float32Array(5);
    const vx = new Float32Array(5);
    const vy = new Float32Array(5);
    const ax = new Float32Array(5);
    const ay = new Float32Array(5);
    const m = new Float32Array(5);

    // Assign the rust simulation's pointers to point to these arrays
    rustWasm.init_simulation(rx, ry, vx, vy, ax, ay, m);

    console.log("rx", rx);

    ReactDOM.render(
      React.createElement(Root, {}),
      document.getElementById("root")
    );
  })
  .catch(console.error);
