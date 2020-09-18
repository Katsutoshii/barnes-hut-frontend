import Stats from "./Stats.js";

export function initStats() {
  // Add stats so we can see FPS
  var stats = Stats();
  stats.dom.style.position = "absolute";
  stats.dom.style.top = "0px";
  stats.dom.style.left = "initial";
  stats.dom.style.right = "0px";
  document.body.appendChild(stats.domElement);

  setInterval(function () {
    stats.update();
  }, 1000 / 60);
}
