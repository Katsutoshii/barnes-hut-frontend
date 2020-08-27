"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _glReactDom = require("gl-react-dom");

var _ErrorBoundary = _interopRequireDefault(require("../utils/ErrorBoundary"));

var _ParticleShader = _interopRequireDefault(require("./ParticleShader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// for React DOM
function ShaderView(props) {
  var xArray = props.xArray,
      yArray = props.yArray;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react["default"].createElement("div", null, "X Pos: ", xArray.join(",")), /*#__PURE__*/_react["default"].createElement("div", null, "Y Pos: ", yArray.join(",")), /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_glReactDom.Surface, {
    width: 300,
    height: 300
  }, /*#__PURE__*/_react["default"].createElement(_ParticleShader["default"], {
    xArray: xArray,
    yArray: yArray
  }))));
}

var _default = ShaderView;
exports["default"] = _default;
//# sourceMappingURL=ParticleView.js.map