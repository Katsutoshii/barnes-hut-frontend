// Inspired from the following https://codepen.io/seanseansean/pen/EaBZEY
"use strict";

import Vertex from "./particles.vert";
import Fragment from "./particles.frag";
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  DEF_NUM_SIMULATE,
  DEF_NUM_STARS,
  DEF_OPTIMIZATION,
  DEF_PAUSE,
  DIMENSION,
  MAX_NUM_SIMULATE,
  MAX_NUM_STARS,
  Optimization,
} from "../common";

let rustWasm;

/* Point cloud variables begin -------------------------
 r = position, m = mass, c = color
*/
let starPoints,
  starR,
  starM = 1,
  starC = [1, 1, 0.5];
let simPoints;
// Initialize arrays in JS
let r = new Float32Array();
let v = new Float32Array();
let a = new Float32Array();
let m = new Float32Array();
const c = new Float32Array(MAX_NUM_SIMULATE * 3);
/* Point cloud variables end ------------------------- */

// Other global variables
let scene, camera, renderer;
// stats
let stats, controls, updateControls;
// For window resize
let windowHalfX, windowHalfY;
// For control
let paused = DEF_PAUSE;
let optimization = DEF_OPTIMIZATION;

// Initialize renderer
export function Init(wasm) {
  rustWasm = wasm;
  // Tell rustWasm to init simulation
  rustWasm.init_simulation(Number(DEF_NUM_SIMULATE));

  r = rustWasm.get_r();
  v = rustWasm.get_v();
  a = rustWasm.get_a();
  m = rustWasm.get_m();

  // Set up ThreeJS scene, camera
  const HEIGHT = window.innerHeight,
    WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  const fieldOfView = 75,
    aspectRatio = WIDTH / HEIGHT,
    nearPlane = 1,
    farPlane = 3000;

  const cameraZ = farPlane / 3,
    fogHex = 0x000000 /* Black	*/,
    fogDensity = 0.0007; /* Not dense	*/

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.z = cameraZ;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(fogHex, fogDensity);

  const container = document.createElement("div");
  document.body.appendChild(container);
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";

  // Stars begin ----------------------
  starR = [];
  for (let i = 0; i < MAX_NUM_STARS; i++) {
    starR.push(Math.random() * 2000 - 1000);
    starR.push(Math.random() * 2000 - 1000);
    starR.push(Math.random() * 2000 - 1000);
  }

  starPoints = initUniformPoints(DEF_NUM_STARS, starR, starM, starC);

  starPoints.rotation.x = Math.random() * 6;
  starPoints.rotation.y = Math.random() * 6;
  starPoints.rotation.z = Math.random() * 6;
  // Stars end ----------------------

  // Simulated particles begin ----------------------
  c.fill(1);
  simPoints = initPoints(DEF_NUM_SIMULATE, r, m, c);
  // Simulated particles end ----------------------

  renderer = new THREE.WebGLRenderer(); /*	Will render particles	*/
  renderer.setPixelRatio(window.devicePixelRatio); /*	Probably 1	*/
  renderer.setSize(WIDTH, HEIGHT); /*	Full screen 	*/

  container.appendChild(renderer.domElement); /* Add to page	*/

  // Add stats so we can see FPS
  stats = Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  stats.domElement.style.left = "initial";
  stats.domElement.style.right = "0px";
  container.appendChild(stats.domElement);

  // Add mouse/mobile controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);

  //   workaround for https://stackoverflow.com/questions/5531100/javascript-stats-js-hi-res-stats-from-mrdoob-how-to-get-current-fps
  const getFPS = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => {
        const before = Date.now();
        let fps = 0;
        requestAnimationFrame((t2) => {
          const now = Date.now();
          fps = Math.round(1000 / (now - before));
          resolve(fps);
        });
      })
    );

  // automatically rotate - if performance hit too hard, disable
  getFPS().then((fps) => {
    console.log(fps);
    updateControls = fps > 30;
    controls.autoRotate = updateControls;
    controls.autoRotateSpeed = 0.2;
  });

  // set where the camera position is; where the controls should orbit around
  camera.position.set(0, 0, -cameraZ / 5);

  /* Event Listeners */
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

// update renderer with new parameters
export function UpdateSimCount(simCount) {
  // Assign the rust simulation's pointers to point to these arrays
  rustWasm.init_simulation(Number(simCount));
  console.log("update sim count done.", r);
  simPoints.geometry.setDrawRange(0, simCount);
}

// update renderer with new parameters
export function UpdateStarCount(starCount) {
  starPoints.geometry.setDrawRange(0, starCount);
}

// update controls with new parameters
export function UpdatePause(p) {
  paused = p;
}

export function UpdateOptimization(o) {
  optimization = o;
}

//   update loop
function animate() {
  requestAnimationFrame(animate);

  if (updateControls) controls.update();
  if (!paused) {
    console.log("run timestep");
    if (optimization == Optimization.BarnesHut) {
      rustWasm.run_timestep_barnes_hut(0.5);
    } else {
      rustWasm.run_timestep(0.5);
    }
  }

  render();
  // update Stats
  stats.update();
}

//   update and render update
function render() {
  // Change star color with time
  let time = Date.now() * 0.00005;
  let hue = ((360 * (starC[0] + time)) % 360) / 360;
  starPoints.material.color.setHSL(hue, starC[1], starC[2]);

  // Tell simulation points to update
  simPoints.geometry.attributes.size.needsUpdate = true;
  simPoints.geometry.attributes.position.needsUpdate = true;
  simPoints.geometry.attributes.color.needsUpdate = true;

  // render to WebGLRenderer
  renderer.render(scene, camera);
}

//   on window resize, resize the webgl renderer
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// init points where size and color are uniform
function initUniformPoints(count, positions, size, color) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, DIMENSION)
  );

  const material = new THREE.PointsMaterial({
    size: size,
    color: new THREE.Color().setHSL(color[0], color[1], color[2]),
  });

  const points = new THREE.Points(geometry, material);
  points.geometry.setDrawRange(0, count);

  // add stars to scene
  scene.add(points);
  return points;
}

// init points where size and color are not uniform
function initPoints(count, positions, sizes, colors) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, DIMENSION)
  );
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes, 1).setUsage(
      THREE.DynamicDrawUsage
    )
  );

  const material = new THREE.ShaderMaterial({
    vertexShader: Vertex,
    fragmentShader: Fragment,

    depthTest: false,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  points.geometry.setDrawRange(0, count);

  // add stars to scene
  scene.add(points);
  return points;
}
