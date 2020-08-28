import ReactDOM from "react-dom";
import Root from "./react/Root";
// import "./shaders/index";

import("../pkg/index.js")
  .then((rustWasm) => {
    console.log(rustWasm);
    // Get rust's wasm memory
    // Then, get the pointer to our buffer that is within wasmMemory
    const rx = new Float32Array(5);
    const ry = new Float32Array(5);
    const m = new Float32Array(5);
    rustWasm.set_rx(rx);
    rustWasm.set_ry(ry);

    ReactDOM.render(
      React.createElement(Root, {
        // TODO: pass in rust props
      }),
      document.getElementById("root")
    );
    // TODO: Call rust to update
    window.requestAnimationFrame(function (timestep) {});
  })
  .catch(console.error);
