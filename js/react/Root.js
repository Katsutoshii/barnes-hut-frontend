"use strict";

function Root() {
  // Display a "Like" <button>
  return <button onClick={() => alert("hi")}>but</button>;
}

ReactDOM.render(<Root />, document.getElementById("root"));
