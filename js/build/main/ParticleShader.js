"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Shader;

var _Particles = _interopRequireDefault(require("../../shaders/Particles.frag"));

var _Particles2 = _interopRequireDefault(require("../../shaders/Particles.vert"));

var _Test = _interopRequireDefault(require("./Test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function compileShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function Shader() {
  var canvas = document.getElementById("canvas");
  console.log("canvas test");

  if (canvas) {
    var gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false
    });
    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    var program = gl.createProgram();
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, _Particles2["default"]));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, _Particles["default"]));
    gl.linkProgram(program);
    gl.useProgram(program);
    console.log("found progmra"); // set resolution

    var resLoc = gl.getUniformLocation(program, "res");
    gl.uniform2f(resLoc, canvas.width, canvas.height); // set viewport

    gl.viewport(0, 0, canvas.width, canvas.height); // set point positions

    var coordBuffer = gl.createBuffer();
    var coordLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(coordLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, _Test["default"], gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(coordLoc, 2, gl.FLOAT, false, 4, 0);
    gl.drawArrays(gl.POINTS, 0, _Test["default"].length / 4);
  }
}
//# sourceMappingURL=ParticleShader.js.map