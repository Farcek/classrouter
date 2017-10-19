"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
function initMethod(target, method) {
    var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target);
    meta.method = method;
}
function GET(target) {
    initMethod(target, common_1.HttpMethod.GET);
}
exports.GET = GET;
function POST(target) {
    initMethod(target, common_1.HttpMethod.POST);
}
exports.POST = POST;
function PUT(target) {
    initMethod(target, common_1.HttpMethod.PUT);
}
exports.PUT = PUT;
function DELETE(target) {
    initMethod(target, common_1.HttpMethod.DELETE);
}
exports.DELETE = DELETE;
function before() {
    var middlewares = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        middlewares[_i] = arguments[_i];
    }
    return function (target) {
        var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target);
        middlewares.forEach(function (it) { return meta.befores.push(it); });
    };
}
exports.before = before;
function view(name) {
    return function (target) {
        var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target);
        meta.viewName = name;
    };
}
exports.view = view;
function validationClass(Clss) {
    return function (target) {
        var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target);
        meta.validationClass = Clss;
    };
}
exports.validationClass = validationClass;
function PATH() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return function (target) {
        var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target);
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            meta.addPath(path);
        }
    };
}
exports.PATH = PATH;
function initParam(target, propertyKey, fieldname, location) {
    var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target.constructor);
    var param = meta.getOrCreateClassRouterParamMeta(propertyKey);
    param.propertyname = propertyKey;
    param.propertytype = Reflect.getMetadata(common_1.ReflectType.TYPE, target, propertyKey);
    param.where = location;
    param.fieldname = fieldname || propertyKey;
}
function Middleware(attachName) {
    return function (target, propertyKey) {
        var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target.constructor);
        meta.middlewares.push(new common_1.ClassRouterMiddlewareMeta(propertyKey, attachName || propertyKey));
    };
}
exports.Middleware = Middleware;
function QueryParam(fieldname) {
    return function (target, propertyKey) { return initParam(target, propertyKey, fieldname, common_1.ParamLocation.Query); };
}
exports.QueryParam = QueryParam;
function PathParam(fieldname) {
    return function (target, propertyKey) { return initParam(target, propertyKey, fieldname, common_1.ParamLocation.Path); };
}
exports.PathParam = PathParam;
function ReqestParam(fieldname) {
    return function (target, propertyKey) { return initParam(target, propertyKey, fieldname, common_1.ParamLocation.Request); };
}
exports.ReqestParam = ReqestParam;
function BodyParam(fieldname) {
    return function (target, propertyKey) { return initParam(target, propertyKey, fieldname, common_1.ParamLocation.Body); };
}
exports.BodyParam = BodyParam;
function CookieParam(fieldname) {
    return function (target, propertyKey) { return initParam(target, propertyKey, fieldname, common_1.ParamLocation.Cookie); };
}
exports.CookieParam = CookieParam;
function HeaderParam(fieldname) {
    return function (target, propertyKey) { return initParam(target, propertyKey, fieldname, common_1.ParamLocation.Header); };
}
exports.HeaderParam = HeaderParam;
function SubRouter() {
    var subRouters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        subRouters[_i] = arguments[_i];
    }
    return function (target) {
        var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target);
        meta.subRouters = meta.subRouters.concat(subRouters);
    };
}
exports.SubRouter = SubRouter;
//# sourceMappingURL=decorators.js.map