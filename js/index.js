var ReactDOM = require("react-dom");
var { Root } = require("./build/Root");

import("../pkg/index.js")
  .then((rustWasm) => {
    console.log(rustWasm);
    // Get rust's wasm memory
    const wasmMemory = new Uint8Array(rustWasm.get_wasm_memory());
    // Then, get the pointer to our buffer that is within wasmMemory
    const pointer = rustWasm.get_wasm_memory_buffer_pointer();
    // Get length
    const length = rustWasm.get_wasm_buffer_size();

    ReactDOM.render(
      React.createElement(
        Root,
        // shallow copy the part of the memory containing the array
        { array: wasmMemory.slice(pointer, pointer + length) }
      ),
      document.getElementById("root")
    );
  })
  .catch(console.error);
