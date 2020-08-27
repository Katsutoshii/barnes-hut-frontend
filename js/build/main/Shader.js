"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Shader;

var _react = _interopRequireDefault(require("react"));

var _glReact = require("gl-react");

var _Particles = _interopRequireDefault(require("../../shaders/Particles.glsl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var shaders = _glReact.Shaders.create({
  GLSL: {
    frag: (0, _glReact.GLSL)(_templateObject(), _Particles["default"])
  }
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