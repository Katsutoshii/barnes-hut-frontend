"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _glReact = require("gl-react");

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  precision mediump int;\n  precision mediump float;\n\n  uniform vec4 u_Color;\n\n  void main() {\n    gl_FragColor = u_Color;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  precision mediump int;\n  precision mediump float;\n\n  uniform vec4 array;\n\n  void main() {\n    gl_FragColor = array;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Shader1 = {
  frag: (0, _glReact.GLSL)(_templateObject()),
  vert: (0, _glReact.GLSL)(_templateObject2())
};
var _default = Shader1;
exports["default"] = _default;
//# sourceMappingURL=Shader1.js.map