import Stats from "./Stats.js";

export function initStats() {
  // Add stats so we can see FPS
  var stats = Stats();
  stats.domElement.className = "stats";
  document.body.appendChild(stats.domElement);

  setInterval(function () {
    stats.update();
  }, 1000 / 60);
}
