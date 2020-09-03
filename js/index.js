import ReactDOM from "react-dom";
import Root from "./react/Root";

import("../pkg/index.js")
  .then((rustWasm) => {
    ReactDOM.render(
      React.createElement(Root, { rustWasm }),
      document.getElementById("root")
    );
  })
  .catch(console.error);
