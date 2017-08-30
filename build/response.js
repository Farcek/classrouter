"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View = (function () {
    function View(name, data) {
        this.name = name;
        this.data = data;
    }
    return View;
}());
exports.View = View;
var Redirect = (function () {
    function Redirect(uri, code) {
        if (code === void 0) { code = 301; }
        this.uri = uri;
        this.code = code;
    }
    return Redirect;
}());
exports.Redirect = Redirect;
//# sourceMappingURL=response.js.map