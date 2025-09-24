"use strict";

import Vertex from "./shaders/particles.vert";
import Fragment from "./shaders/particles.frag";
import HaloFragment from "./shaders/halo.frag";
import HaloVert from "./shaders/halo.vert";
import StarsFragment from "./shaders/stars.frag";
import StarsVert from "./shaders/stars.vert";
import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";
import {
  DEF_DT,
  DEF_NUM_SIMULATE,
  DEF_NUM_STARS,
  DEF_OPTIMIZATION,
  DEF_PAUSE,
  DEF_THETA,
  DIMENSION,
  MAX_NUM_SIMULATE,
  MAX_NUM_STARS,
  Optimization,
} from "../common";

export interface RustWasm {
  init_simulation(simCount: number): void;
  get_r(): Float32Array;
  get_v(): Float32Array;
  get_a(): Float32Array;
  get_m(): Float32Array;
  get_num_blackhole(): number;
  gen_blackhole(x: number, y: number): void;
  run_timestep(dt: number): void;
  run_timestep_barnes_hut(dt: number, theta: number): void;
}

let rustWasm: RustWasm;

/* Point cloud variables begin -------------------------
 r = position, m = mass, c = color
*/
interface StarPoints extends THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> {}
interface SimPoints extends THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> {}

let starPoints: StarPoints,
  starC: THREE.Color = new THREE.Color(0x3535aa);
let simPoints: SimPoints;
// Initialize simulation arrays in JS
let r : Float32Array, 
  // v, a, 
  m : Float32Array;
const c = new Float32Array(MAX_NUM_SIMULATE * 3);
// number of black holes
let numBH = 0;
/* Point cloud variables end ------------------------- */

// Other three.js-related global variables
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, raycaster: THREE.Raycaster;
let controls: OrbitControls, updateControls;
let backdrop: THREE.Mesh;
// For window resize
let windowHalfX, windowHalfY: number;
// For time uniform in shaders
let startTime: number;
// For controls defined in Controls.tsx
let paused = DEF_PAUSE;
let optimization = DEF_OPTIMIZATION;
let theta = DEF_THETA,
  dt = DEF_DT;

// Other general global variables
// Distinguish click events from dragging: https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
const delta = 6;
let startX: number;
let startY: number;

// Initialize renderer
export function init(wasm: RustWasm) {
  rustWasm = wasm;
  // Tell rustWasm to init simulation
  rustWasm.init_simulation(Number(DEF_NUM_SIMULATE));

  r = rustWasm.get_r();

  // assign random Z to simulate '3D' effect
  for (let i = 2; i < r.length; i += 3) {
    r[i] = Math.random() * 2000 - 1000;
  }

  // v = rustWasm.get_v();
  // a = rustWasm.get_a();
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

  const cameraZ = farPlane / 4;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  // Set where the camera position is
  camera.position.set(0, 0, cameraZ);

  scene = new THREE.Scene();

  const container = document.createElement("div");
  container.id = "galaxy";
  document.body.appendChild(container);

  // Stars begin ----------------------
  const starR = new Float32Array(MAX_NUM_STARS * DIMENSION);
  const starM = new Float32Array(MAX_NUM_STARS);
  const starExp = new Float32Array(MAX_NUM_STARS);
  const STAR_WIDTH = WIDTH * 0.5;

  for (let i = 0; i < MAX_NUM_STARS; i++) {
    starR[i * 3] = Math.random() * STAR_WIDTH - STAR_WIDTH / 2;
    starR[i * 3 + 1] = Math.random() * STAR_WIDTH - STAR_WIDTH / 2;
    starR[i * 3 + 2] = Math.random() * STAR_WIDTH * 2 - STAR_WIDTH;

    let increment;
    let random = Math.random();
    // randomize
    if (random > 0.5) {
      // circle
      increment = 1.1;
      starExp[i] = 2;
    } else if (random > 0.25) {
      // star
      increment = 1.7;
      starExp[i] = 0.75;
    } else {
      // pointy star
      increment = 1.75;
      starExp[i] = 0.5;
    }
    // randomize mass
    starM[i] = (Math.random() + increment) * increment * 1.5;
  }

  starPoints = initStarPoints(
    DEF_NUM_STARS,
    starR,
    starM,
    starC,
    starExp
  );
  // Stars end ----------------------

  // Backdrop start ----------------------
  var geometry = new THREE.PlaneGeometry(WIDTH * 1.5, HEIGHT * 1.5);
  var texture = new THREE.TextureLoader().load(
    "graphics/stars.png",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // repeat
      texture.repeat.set(3, 3);
    }
  );
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: starC,
  });
  backdrop = new THREE.Mesh(geometry, material);
  backdrop.position.z = -farPlane / 2;
  scene.add(backdrop);
  // Backdrop end ----------------------

  // Simulated particles begin ----------------------
  // Create glow
  // Referenced https://github.com/spite/looper/blob/master/loops/253.js
  const glowRadius = 300;
  const glowMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      max: { value: glowRadius / 2 },
    },
    vertexShader: HaloVert,
    fragmentShader: HaloFragment,

    alphaTest: 0.5,
    transparent: true,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(glowRadius, glowRadius),
    glowMaterial
  );
  glow.position.z = -10;
  scene.add(glow);
  // Create actual points
  c.fill(1);
  tryUpdateBlackHoles();
  simPoints = initSimPoints(DEF_NUM_SIMULATE, r, m, c);
  // Simulated particles end ----------------------

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio); /*	Probably 1	*/
  renderer.setSize(WIDTH, HEIGHT); /*	Full screen 	*/

  container.appendChild(renderer.domElement); /* Add to page	*/

  // Add mouse/mobile controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  // Set controls' limits
  controls.minDistance = cameraZ * 0.75;
  controls.maxDistance = cameraZ * 1.5;
  // Limit vertical rotation
  controls.minPolarAngle = Math.PI * 0.4; // radians
  controls.maxPolarAngle = Math.PI * 0.6; // radians
  // Limit horizontal rotation
  controls.minAzimuthAngle = -Math.PI * 0.1; // radians
  controls.maxAzimuthAngle = Math.PI * 0.1; // radians

  // Event listeners
  // Change camera on window resize
  window.addEventListener("resize", onWindowResize, false);
  const onDown: any = (event: { preventDefault: () => void; pageX: any; pageY: any; }) => {
    // Move this call from OrbitControls.js to here
    // To prevent the browser from scrolling.
    event.preventDefault();
    startX = event.pageX;
    startY = event.pageY;
  };
  // Differentiate between click and drag
  // If click, create new blackhole
  renderer.domElement.addEventListener("mousedown", onDown);
  renderer.domElement.addEventListener("touchstart", onDown);
  const onUp: any = (event: { preventDefault: () => void; pageX: number; pageY: number; }) => {
    // Move this call from OrbitControls.js to here
    event.preventDefault();

    const diffX = Math.abs(event.pageX - startX);
    const diffY = Math.abs(event.pageY - startY);

    if (diffX < delta && diffY < delta) {
      // Click!
      onClick(event);
    }
  };
  renderer.domElement.addEventListener("click", onUp);
  // Initialize rest of global variables
  raycaster = new THREE.Raycaster();
  startTime = Date.now();

  animate();
}

// Set simPoints' count
export function setSimCount(simCount: number) {
  rustWasm.init_simulation(Number(simCount));
  simPoints.geometry.setDrawRange(0, simCount);
  setSimPos();
  setSimSize();
}

// Set starPoints' count
export function setStarCount(starCount: number) {
  starPoints.geometry.setDrawRange(0, starCount);
}

// Play or pause simulation
export function setPause(p: boolean) {
  paused = p;
  if (!paused) {
    setSimPos();
  }
}

// Set type of optimization for simulation
export function setOptimization(o: Optimization) {
  optimization = o;
}

// Set theta of simulation - accuracy
export function setTheta(t: number) {
  theta = t;
}

// Set delta time of simulation - how fast it goes
export function setDT(t: number) {
  dt = t;
}

/*
 Set BufferGeometry's position attribute
 Because for some reason, sometimes it won't get updated unless manually set .array
 */
function setSimPos() {
  if (simPoints) {
    // const positionAttr = simPoints.geometry.getAttribute("position") as THREE.BufferAttribute;
    // positionAttr.copyArray(r);
    // positionAttr.needsUpdate = true;
    simPoints.geometry.setAttribute( 'position', new THREE.BufferAttribute( r, DIMENSION ) );
  }
}

// Update BufferGeometry's size attribute
function setSimSize() {
  if (simPoints) {
    // simPoints.geometry.getAttribute("size").array = m;
    // const positionAttr = simPoints.geometry.getAttribute("size") as THREE.BufferAttribute;
    // positionAttr.copyArray(m);
    // simPoints.geometry.attributes.size.needsUpdate = true;
    simPoints.geometry.setAttribute( 'size', new THREE.BufferAttribute( m, 1 ) );
  }
}

// Set BufferGeometry's color attribute
function setSimColor() {
  if (simPoints) {
    // simPoints.geometry.getAttribute("color").array = c;
    // const positionAttr = simPoints.geometry.getAttribute("color") as THREE.BufferAttribute;
    // positionAttr.copyArray(c);
    // simPoints.geometry.attributes.color.needsUpdate = true;
    simPoints.geometry.setAttribute( 'color', new THREE.BufferAttribute( c, DIMENSION ) );
  }
}

// Init starry point cloud
function initStarPoints(count: number, positions: number | ArrayBuffer | Iterable<number> | ArrayLike<number>, size: number | ArrayBuffer | Iterable<number> | ArrayLike<number>, color: THREE.Color, p: number | ArrayBuffer | Iterable<number> | ArrayLike<number>) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, DIMENSION)
  );

  geometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(size, 1)
  );

  geometry.setAttribute("p", new THREE.Float32BufferAttribute(p, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
      time: { value: 1.0 },
    },

    vertexShader: StarsVert,
    fragmentShader: StarsFragment,

    blending: THREE.AdditiveBlending,
    alphaTest: 0.5,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.geometry.setDrawRange(0, count);

  scene.add(points);
  return points;
}

// Init simulation point cloud
function initSimPoints(count: number, position: number | ArrayBuffer | Iterable<number> | ArrayLike<number>, size: number | ArrayBuffer | Iterable<number> | ArrayLike<number>, colors: number | ArrayBuffer | Iterable<number> | ArrayLike<number>) {
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
    uniforms: {
      time: { value: 1.0 },
      height: { value: windowHalfY },
    },

    vertexShader: Vertex,
    fragmentShader: Fragment,

    alphaTest: 0.5,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  points.geometry.setDrawRange(0, count);

  scene.add(points);
  return points;
}

/* 
Test to see if number of black holes changed
If so, update simPoints' buffer attributes
*/
function tryUpdateBlackHoles() {
  const n = rustWasm.get_num_blackhole();
  if (n == numBH) {
    return;
  }
  // if add black hole
  if (n > numBH) {
    for (let i = numBH; i < n; i++) {
      c[i * 3] = 0.07;
      c[i * 3 + 1] = 0.01;
      c[i * 3 + 2] = 0.08;
    }
  }
  // if delete black hole
  if (n < numBH) {
    for (let i = n; i < numBH; i++) {
      c[i * 3] = 1;
      c[i * 3 + 1] = 1;
      c[i * 3 + 2] = 1;
    }
  }

  numBH = n;
  // Hack around the fact that m gets invalidated at this point sometimes due to WebAssembly limitations
  m = rustWasm.get_m();
  setSimSize();
  setSimPos();
  setSimColor();
}

// Update loop
function animate() {
  requestAnimationFrame(animate);

  if (updateControls) controls.update();

  render();
}

// Update threejs scene
function render() {
  changeStarsHue();

  setTime();

  tryUpdateBlackHoles();

  // render to WebGLRenderer
  renderer.render(scene, camera);

  // must call this after render if common.DEF_PAUSE == false
  checkPlay();
}

// Set time uniform in all shaders that take in time
function setTime() {
  let elapsedMilliseconds = Date.now() - startTime;
  simPoints.material.uniforms.time.value = elapsedMilliseconds / 4000;
  starPoints.material.uniforms.time.value =
    elapsedMilliseconds / 4000;
}

// Change star color with time
function changeStarsHue() {
  let time = 0.0005;
  starC = starC.offsetHSL(time, 0, 0);
  starPoints.material.uniforms.color.value = starC;
  (backdrop.material as THREE.MeshBasicMaterial).color = starC;
}

// Check if we should run timestep
function checkPlay() {
  if (!paused) {
    r = rustWasm.get_r();
    if (optimization == Optimization.BarnesHut) {
      rustWasm.run_timestep_barnes_hut(dt, theta);
    } else {
      rustWasm.run_timestep(dt);
    }
    // Tell simulation points to update
    setSimPos();
  }
}

// On click, generate new black hole
function onClick(event: { preventDefault: () => void; pageX: number; pageY: number; }) {
  event.preventDefault();

  var planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1));

  var mv = new THREE.Vector2(
    (event.pageX / window.innerWidth) * 2 - 1,
    -(event.pageY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mv, camera);
  var pos = new THREE.Vector3();
  raycaster.ray.intersectPlane(planeZ, pos);

  if (pos.x && pos.y) {
    rustWasm.gen_blackhole(pos.x, pos.y);
  }
}

// On window resize, resize the webgl renderer
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  simPoints.material.uniforms.height.value = windowHalfY;

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
