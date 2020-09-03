// Inspired from the following https://codepen.io/seanseansean/pen/EaBZEY

(function () {
  "use strict";
  // 'To actually be able to display anything with Three.js, we need three things:
  // A scene, a camera, and a renderer so we can render the scene with the camera.'
  // - https://threejs.org/docs/#Manual/Introduction/Creating_a_scene

  var scene, camera, renderer;

  // We need this stuff too
  var container,
    HEIGHT,
    WIDTH,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    stats,
    geometry,
    particleCount,
    i,
    h,
    color,
    size,
    material,
    controls,
    windowHalfX,
    windowHalfY,
    cameraZ,
    fogHex,
    fogDensity,
    points,
    updateControls;

  init();
  animate();

  function init() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    /* 	fieldOfView — Camera frustum vertical field of view.
	aspectRatio — Camera frustum aspect ratio.
	nearPlane — Camera frustum near plane.
	farPlane — Camera frustum far plane.

	- https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

	In geometry, a frustum (plural: frusta or frustums)
	is the portion of a solid (normally a cone or pyramid)
    that lies between two parallel planes cutting it. - wikipedia.		*/

    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 1;
    farPlane = 3000;

    cameraZ = farPlane / 3;
    fogHex = 0x000000; /* Black	*/
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

    container = document.createElement("div");
    document.body.appendChild(container);
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";

    geometry = new THREE.Geometry();

    particleCount = 200000;

    for (i = 0; i < particleCount; i++) {
      var vertex = new THREE.Vector3();
      //   TODO: set in rust
      vertex.x = Math.random() * 2000 - 1000;
      vertex.y = Math.random() * 2000 - 1000;
      vertex.z = Math.random() * 2000 - 1000;

      geometry.vertices.push(vertex);
    }

    // Set color, size, and rotation
    // TODO: set size from rust https://discourse.threejs.org/t/instancing-point-cloud/12280
    color = [1, 1, 0.5];
    size = 1;
    material = new THREE.PointsMaterial({
      size: size,
    });
    points = new THREE.Points(geometry, material);
    points.rotation.x = Math.random() * 6;
    points.rotation.y = Math.random() * 6;
    points.rotation.z = Math.random() * 6;

    // add point cloud to scene
    scene.add(points);

    renderer = new THREE.WebGLRenderer(); /*	Will render particles	*/
    renderer.setPixelRatio(window.devicePixelRatio); /*	Probably 1	*/
    renderer.setSize(WIDTH, HEIGHT); /*	Full screen 	*/

    container.appendChild(renderer.domElement); /* Add to page	*/

    // Add stats so we can see FPS
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    stats.domElement.style.right = "0px";
    container.appendChild(stats.domElement);

    // Add mouse/mobile controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.z = cameraZ;

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

    // automatically rotate... if performance hit too hard, disable
    getFPS().then((fps) => {
      console.log(fps);
      updateControls = fps > 30;
      controls.autoRotate = updateControls;
      controls.autoRotateSpeed = 0.015;
    });

    // set where the camera position is; where the controls should orbit around
    camera.position.set(0, 20, 100);

    /* Event Listeners */
    window.addEventListener("resize", onWindowResize, false);
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
    // TODO: Change particle positions here
    // https://threejs.org/docs/#manual/en/introduction/How-to-update-things
    // Change color with time
    var time = Date.now() * 0.00005;
    h = ((360 * (color[0] + time)) % 360) / 360;
    material.color.setHSL(h, color[1], color[2]);

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
})();
