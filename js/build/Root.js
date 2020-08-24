"use strict";

require("../scss/App.scss");

var _ShaderView = _interopRequireDefault(require("./main/ShaderView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

"use strict";

function Root(props) {
  var array = props.array;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_ShaderView["default"], {
    array: array
  }));
}

module.exports = {
  Root: Root
};
//# sourceMappingURL=Root.js.map