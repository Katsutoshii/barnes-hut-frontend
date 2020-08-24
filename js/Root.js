"use strict";

function Root() {
  // Display a "Like" <button>
  return React.createElement(
    "button",
    { onClick: function onClick() {
        return alert("hi");
      } },
    "but"
  );
}

ReactDOM.render(React.createElement(Root, null), document.getElementById("root"));