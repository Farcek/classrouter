"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Response = (function () {
    function Response() {
    }
    return Response;
}());
exports.Response = Response;
var View = (function (_super) {
    __extends(View, _super);
    function View(name, data) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.data = data;
        _this.contentType = 'text/html';
        return _this;
    }
    return View;
}(Response));
exports.View = View;
var Redirect = (function (_super) {
    __extends(Redirect, _super);
    function Redirect(uri, code) {
        if (code === void 0) { code = 301; }
        var _this = _super.call(this) || this;
        _this.uri = uri;
        _this.statusCode = code;
        return _this;
    }
    return Redirect;
}(Response));
exports.Redirect = Redirect;
var Raw = (function (_super) {
    __extends(Raw, _super);
    function Raw(contentType, body) {
        var _this = _super.call(this) || this;
        _this.body = body;
        if (contentType)
            _this.contentType = contentType;
        return _this;
    }
    return Raw;
}(Response));
exports.Raw = Raw;
//# sourceMappingURL=response.js.map