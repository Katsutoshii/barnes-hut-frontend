"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _glReactDom = require("gl-react-dom");

var _ErrorBoundary = _interopRequireDefault(require("./../utils/ErrorBoundary"));

var _Shader = _interopRequireDefault(require("./Shader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// for React DOM
function ShaderView(props) {
  var array = props.array;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react["default"].createElement("div", null, "Input: ", array.join(",")), /*#__PURE__*/_react["default"].createElement(_ErrorBoundary["default"], null, /*#__PURE__*/_react["default"].createElement(_glReactDom.Surface, {
    width: 300,
    height: 300
  }, /*#__PURE__*/_react["default"].createElement(_Shader["default"], {
    array: array
  }))));
}

var _default = ShaderView;
exports["default"] = _default;
//# sourceMappingURL=ShaderView.js.map