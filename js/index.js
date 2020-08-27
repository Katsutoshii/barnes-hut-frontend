import ReactDOM from "react-dom";
import Root from "./react/Root";

import("../pkg/index.js")
  .then((rustWasm) => {
    console.log(rustWasm);
    // Get rust's wasm memory
    const wasmMemory = new Uint8Array(rustWasm.get_wasm_memory());
    // Then, get the pointer to our buffer that is within wasmMemory
    const x_pointer = rustWasm.get_x_positions_pointer();
    const y_pointer = rustWasm.get_y_positions_pointer();
    // Get length
    const length = rustWasm.get_wasm_buffer_size();

    ReactDOM.render(
      React.createElement(
        Root,
        // shallow copy the part of the memory containing the array
        {
          xArray: wasmMemory.slice(x_pointer, x_pointer + length),
          yArray: wasmMemory.slice(y_pointer, y_pointer + length),
        }
      ),
      document.getElementById("root")
    );
  })
  .catch(console.error);
