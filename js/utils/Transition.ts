// Referenced https://codepen.io/ReGGae/pen/rNxpVEd

import gsap from "gsap";
import Vertex from "./shaders/transition.vert";
import Fragment from "./shaders/transition.frag";
import * as THREE from "three";

class Transition {
  parent: Element;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  scene: THREE.Scene;
  triangle: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  tl: gsap.core.Timeline;
  animating: boolean;
  reverse: boolean;
  //  width/height
  bounds: {
    w: number;
    h: number;
  };

  constructor(
    parent: Element,
    rotation: number,
    duration: number,
    initialHidden: boolean
  ) {
    this.parent = parent;

    this.rebounds();
    const { w, h } = this.bounds;

    if (initialHidden) {
      this.parent.classList.add("hidden");
    }

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(
      w / -2,
      w / 2,
      h / 2,
      h / -2,
      1,
      100
    );
    this.camera.lookAt(this.scene.position);
    this.camera.position.z = 1;

    parent.appendChild(this.renderer.domElement);

    const geo = new THREE.BufferGeometry();

    const vertices = new Float32Array([
      -1,
      -1,
      0,
      3,
      -1,
      0,
      -1,
      3,
      0,
    ]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );

    this.mat = new THREE.ShaderMaterial({
      vertexShader: Vertex,
      fragmentShader: Fragment,
      uniforms: {
        uProgress: { value: 0 },
        uPower: { value: 0 },
        uOut: { value: true },
      },
    });

    this.triangle = new THREE.Mesh(geo, this.mat);
    let s = w > h ? w : h;
    this.triangle.scale.set(s / 2, s / 2, 1);
    this.triangle.frustumCulled = false;
    this.triangle.rotation.z = rotation;
    this.scene.add(this.triangle);

    this.tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: duration,
        ease: "power3.inOut",
      },
    });
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  out = () => {
    this.animating = true;
    this.reverse = true;

    this.parent.classList.remove("hidden");
    this.parent.classList.remove("out");

    const { uProgress } = this.mat.uniforms;

    this.tl
      .clear()
      .to(
        uProgress,
        {
          value: 1,
          onUpdate: () => this.render(),
        },
        0
      )
      .to(
        this.bend(),
        {
          progress: 1,
        },
        0
      )
      .add(() => {
        this.animating = false;
      })
      .play();
  };

  in = () => {
    this.animating = true;
    this.reverse = false;
    this.parent.classList.add("out");

    const { uProgress } = this.mat.uniforms;

    this.tl
      .clear()
      .to(
        uProgress,
        {
          value: 0,
          onUpdate: () => this.render(),
        },
        0
      )
      .to(
        this.bend(),
        {
          progress: 1,
        },
        0
      )
      .add(() => {
        this.animating = false;
        this.parent.classList.add("hidden");
      })
      .play();
  };

  bend = () => {
    const { uPower } = this.mat.uniforms;

    return gsap
      .timeline({
        paused: true,
        defaults: {
          ease: "linear",
          duration: 0.5,
        },
      })
      .to(uPower, { value: 1 })
      .to(uPower, { value: 0 });
  };

  resize = () => {
    this.rebounds();
    const { w, h } = this.bounds;

    this.camera.left = w / -2;
    this.camera.right = w / 2;
    this.camera.top = h / 2;
    this.camera.bottom = h / -2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);

    let s = w > h ? w : h;
    this.triangle.scale.set(s / 2, s / 2, 1);
  };

  private rebounds() {
    this.bounds = {
      w: this.parent.scrollWidth,
      h: this.parent.scrollHeight,
    };
  }
}

export function initTransition(parent, rotation, duration, hidden) {
  if (parent == null) {
    return;
  }

  const transition = new Transition(
    parent,
    rotation,
    duration,
    hidden
  );

  window.addEventListener("resize", () => {
    transition.resize();
  });

  return transition;
}

export function onClick(transition: Transition) {
  if (transition.animating) return;
  transition.reverse ? transition.in() : transition.out();
}
