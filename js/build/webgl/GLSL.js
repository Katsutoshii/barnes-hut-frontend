"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _glReact = require("gl-react");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  precision highp float;\n  varying vec2 uv;\n  uniform vec4 array;\n  void main() {\n    gl_FragColor = array * vec4(uv.x, uv.y, 1.0, 1.0);\n  }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Shader1 = {
  frag: (0, _glReact.GLSL)(_templateObject())
};
var _default = Shader1;
exports["default"] = _default;
//# sourceMappingURL=GLSL.js.map