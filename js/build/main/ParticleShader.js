"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Shader;

var _react = _interopRequireDefault(require("react"));

var _glReact = require("gl-react");

var _Particles = _interopRequireDefault(require("../../shaders/Particles.frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// import Vert from "../../shaders/Particles.vert";
var shaders = _glReact.Shaders.create({
  Particles: {
    frag: (0, _glReact.GLSL)(_templateObject(), _Particles["default"]) // vert: GLSL`${Vert}`,

  }
});

function Shader(props) {
  return /*#__PURE__*/_react["default"].createElement(_glReact.Node, {
    shader: shaders.Particles,
    uniforms: _objectSpread({}, props)
  });
}
//# sourceMappingURL=ParticleShader.js.map