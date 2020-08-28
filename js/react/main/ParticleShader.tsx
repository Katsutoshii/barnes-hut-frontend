import Fragment from "../../shaders/Particles.frag";
import Vert from "../../shaders/Particles.vert";
import points from "./Test";

function compileShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function Shader() {
  const canvas = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;

  console.log("canvas test");

  if (canvas) {
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false,
    });
    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const program = gl.createProgram();

    gl.attachShader(
      program,
      compileShader(gl, gl.VERTEX_SHADER, Vert)
    );
    gl.attachShader(
      program,
      compileShader(gl, gl.FRAGMENT_SHADER, Fragment)
    );

    gl.linkProgram(program);
    gl.useProgram(program);

    console.log("found progmra");

    // set resolution
    let resLoc = gl.getUniformLocation(program, "res");
    gl.uniform2f(resLoc, canvas.width, canvas.height);

    // set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // set point positions
    let coordBuffer = gl.createBuffer();
    let coordLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(coordLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(coordLoc, 2, gl.FLOAT, false, 4, 0);
    gl.drawArrays(gl.POINTS, 0, points.length / 4);
  }
}
