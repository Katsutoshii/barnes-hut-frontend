"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Root;

require("../scss/App.scss");

var _ParticleView = _interopRequireDefault(require("./main/ParticleView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Root(props) {
  var xArray = props.xArray,
      yArray = props.yArray;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_ParticleView["default"], null));
}
//# sourceMappingURL=Root.js.map