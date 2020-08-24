"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _glReact = require("gl-react");

var _Shader = _interopRequireDefault(require("../webgl/Shader1"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var shaders = _glReact.Shaders.create({
  Shader1: _Shader["default"]
});

function ShaderView(props) {
  var array = props.array;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react["default"].createElement(ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_glReact.Node, {
    shader: shaders.Shader1,
    uniforms: {
      array: array
    }
  })));
}

var _default = ShaderView;
exports["default"] = _default;
//# sourceMappingURL=ShaderView.js.map