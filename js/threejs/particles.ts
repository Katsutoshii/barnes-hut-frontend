// Inspired from the following https://codepen.io/seanseansean/pen/EaBZEY
"use strict";

import Vertex from "./particles.vert";
import Fragment from "./particles.frag";
import StarsFragment from "./stars.frag";
import StarsVert from "./stars.vert";
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "./OrbitControls";
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
  starC = new THREE.Color(0x3535aa);

let simPoints;
// Initialize simulation arrays in JS
let r, v, a, m;
const c = new Float32Array(MAX_NUM_SIMULATE * 3);
/* Point cloud variables end ------------------------- */

// Other global variables
let scene, camera, renderer, raycaster;
// stats
let stats, controls, updateControls;
// For window resize
let windowHalfX, windowHalfY;
// For control
let paused = DEF_PAUSE;
let optimization = DEF_OPTIMIZATION;

// General JS
// Distinguish click events from dragging: https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
const delta = 6;
let startX;
let startY;

// Initialize renderer
export function init(wasm) {
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
    farPlane = 1000;

  const cameraZ = farPlane / 6,
    fogHex = 0x000000 /* Black	*/,
    fogDensity = 0.0007; /* Not dense	*/

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(fogHex, fogDensity);

  const container = document.createElement("div");
  document.body.appendChild(container);

  // Stars begin ----------------------
  const starR = new Float32Array(MAX_NUM_STARS * DIMENSION);
  const starM = new Float32Array(MAX_NUM_STARS * 1);

  // [1, 1, 0.5]
  for (let i = 0; i < MAX_NUM_STARS; i++) {
    starR[i] = Math.random() * 2000 - 1000;
    starR[i + 1] = Math.random() * 2000 - 1000;
    starR[i + 2] = Math.random() * 2000 - 1000;

    // randomize mass
    starM[i] = (Math.random() + 1.5) * 2;
  }

  starPoints = initUniformPoints(DEF_NUM_STARS, starR, starM, starC);

  starPoints.rotation.x = Math.random() * 6;
  starPoints.rotation.y = Math.random() * 6;
  starPoints.rotation.z = Math.random() * 6;
  // Stars end ----------------------

  // Simulated particles begin ----------------------
  c.fill(1);
  updateBlackHoles();
  simPoints = initPoints(DEF_NUM_SIMULATE, r, m, c);
  simPoints.geometry.computeBoundingSphere();
  // Simulated particles end ----------------------

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  }); /*	Will render particles	*/
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
    updateControls = fps > 30;
    controls.autoRotate = updateControls;
    controls.autoRotateSpeed = 0.2;
  });

  // set where the camera position is; where the controls should orbit around
  camera.position.set(0, 0, cameraZ);

  // add raycaster
  raycaster = new THREE.Raycaster();

  /* Event Listeners */
  // Change camera on window resize
  window.addEventListener("resize", onWindowResize, false);
  // Differentiate between click and drag
  // If click, create new blackhole
  renderer.domElement.addEventListener("mousedown", (event) => {
    // Move this call from OrbitControls.js to here
    // Prevent the browser from scrolling.
    event.preventDefault();
    startX = event.pageX;
    startY = event.pageY;
  });
  renderer.domElement.addEventListener("mouseup", (event) => {
    // Move this call from OrbitControls.js to here
    event.preventDefault();

    const diffX = Math.abs(event.pageX - startX);
    const diffY = Math.abs(event.pageY - startY);

    if (diffX < delta && diffY < delta) {
      // Click!
      onClick(event);
    }
  });

  animate();
}

// update renderer with new parameters
export function updateSimCount(simCount) {
  // Assign the rust simulation's pointers to point to these arrays
  rustWasm.init_simulation(Number(simCount));
  simPoints.geometry.setDrawRange(0, simCount);
  updateSimPos();
  updateSimSize();
  console.log(r, m);
}

// update renderer with new parameters
export function updateStarCount(starCount) {
  starPoints.geometry.setDrawRange(0, starCount);
}

// update controls with new parameters
export function updatePause(p) {
  paused = p;
  if (!paused && simPoints) {
    updateSimPos();
  }
}

export function updateOptimization(o) {
  optimization = o;
}

/*
 Update BufferGeometry's position attribute
 Because for some reason, sometimes it won't get updated unless manually set .array
 */
function updateSimPos() {
  if (simPoints) {
    simPoints.geometry.getAttribute("position").array = r;
    simPoints.geometry.attributes.position.needsUpdate = true;
  }
}

/*
 Update BufferGeometry's size attribute
 */
function updateSimSize() {
  if (simPoints) {
    simPoints.geometry.getAttribute("size").array = m;
    simPoints.geometry.attributes.size.needsUpdate = true;
  }
}

/*
 Update BufferGeometry's color attribute
 */
function updateSimColor() {
  if (simPoints) {
    simPoints.geometry.getAttribute("color").array = c;
    simPoints.geometry.attributes.color.needsUpdate = true;
  }
}

// init points where size and color are uniform
function initUniformPoints(count, positions, size, color) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, DIMENSION)
  );
  geometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(size, 1)
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
    },

    vertexShader: StarsVert,
    fragmentShader: StarsFragment,

    blending: THREE.AdditiveBlending,
    alphaTest: 0.5,
  });

  const points = new THREE.Points(geometry, material);
  points.geometry.setDrawRange(0, count);

  // add stars to scene
  scene.add(points);
  return points;
}

// init points where size and color are not uniform
function initPoints(count, position, size, colors) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(position, DIMENSION).setUsage(
      THREE.DynamicDrawUsage
    )
  );
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );
  geometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(size, 1).setUsage(
      THREE.DynamicDrawUsage
    )
  );

  const material = new THREE.ShaderMaterial({
    vertexShader: Vertex,
    fragmentShader: Fragment,

    blending: THREE.AdditiveBlending,
    alphaTest: 0.5,
    vertexColors: true,
  });

  const points = new THREE.Points(geometry, material);
  points.geometry.setDrawRange(0, count);

  // add stars to scene
  scene.add(points);
  return points;
}

/* 
When a new black hole is created, array m changes
init black hole colors and size
*/
function updateBlackHoles() {
  const n = rustWasm.get_num_blackhole();
  for (let i = 0; i < n; i++) {
    c[i * 3] = 0.06;
    c[i * 3 + 1] = 0;
    c[i * 3 + 2] = 0.07;
  }

  updateSimSize();
  updateSimPos();
  updateSimColor();
}

//   update loop
function animate() {
  requestAnimationFrame(animate);

  if (updateControls) controls.update();

  render();

  // update Stats
  stats.update();
}

//   update and render update
function render() {
  checkPlay();

  changeStarsHue();

  // render to WebGLRenderer
  renderer.render(scene, camera);
}

// Change star color with time
function changeStarsHue() {
  let time = 0.0005;
  starC = starC.offsetHSL(time, 0, 0);
  starPoints.material.uniforms.color.value = starC;
}

// check if we should run timestep
function checkPlay() {
  if (!paused) {
    if (optimization == Optimization.BarnesHut) {
      rustWasm.run_timestep_barnes_hut(0.1);
    } else {
      rustWasm.run_timestep(0.1);
    }
    // Tell simulation points to update
    simPoints.geometry.attributes.position.needsUpdate = true;
  }
}

// on click, generate new black hole
function onClick(event) {
  event.preventDefault();

  var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1));

  var mv = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mv, camera);
  var pos = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeZ, pos);

  if (pos.x && pos.y) {
    rustWasm.gen_blackhole(pos.x, pos.y);
    updateBlackHoles();
  }
}

//   on window resize, resize the webgl renderer
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
