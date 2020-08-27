import ReactDOM from "react-dom";
import Root from "./react/Root";

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
      React.createElement(
        Root,
        // shallow copy the part of the memory containing the array
        {
          xArray: rx,
          yArray: ry,
        }
      ),
      document.getElementById("root")
    );
  })
  .catch(console.error);
