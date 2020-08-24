"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Shader;

var _react = _interopRequireDefault(require("react"));

var _glReact = require("gl-react");

var _GLSL = _interopRequireDefault(require("../webgl/GLSL"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var shaders = _glReact.Shaders.create({
  GLSL: _GLSL["default"]
});

function Shader(props) {
  var array = props.array;
  return /*#__PURE__*/_react["default"].createElement(_glReact.Node, {
    shader: shaders.GLSL,
    uniforms: {
      array: array
    }
  });
}
//# sourceMappingURL=Shader.js.map