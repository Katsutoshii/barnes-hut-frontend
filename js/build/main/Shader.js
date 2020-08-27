"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Shader;

var _react = _interopRequireDefault(require("react"));

var _glReact = require("gl-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    precision highp float;\n    varying vec2 uv;\n    uniform vec4 array;\n    void main() {\n      gl_FragColor = array * vec4(uv.x, uv.y, 1.0, 1.0);\n    }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// import Particles from "../../shaders/Particles.glsl";
var shaders = _glReact.Shaders.create({
  GLSL: {
    frag: (0, _glReact.GLSL)(_templateObject())
  }
});

function Shader(props) {
  // console.log(Particles);
  var array = props.array;
  return /*#__PURE__*/_react["default"].createElement(_glReact.Node, {
    shader: shaders.GLSL,
    uniforms: {
      array: array
    }
  });
}
//# sourceMappingURL=Shader.js.map