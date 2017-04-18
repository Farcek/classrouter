"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var class_transformer_1 = require("class-transformer");
function initTypecast(target, propertyKey, typecast) {
    var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(target.constructor);
    var param = meta.getOrCreateClassRouterParamMeta(propertyKey);
    param.typecast = typecast;
}
function str2int() {
    return function (target, propertyKey) {
        initTypecast(target, propertyKey, function (paramValue) {
            return parseInt(paramValue.value);
        });
    };
}
exports.str2int = str2int;
function str2Date() {
    return function (target, propertyKey) {
        initTypecast(target, propertyKey, function (paramValue) {
            return new Date(paramValue.value);
        });
    };
}
exports.str2Date = str2Date;
function plain2Class(clss) {
    return function (target, propertyKey) {
        initTypecast(target, propertyKey, function (paramValue, paramMeta) {
            return class_transformer_1.plainToClass(clss, paramValue.value);
        });
    };
}
exports.plain2Class = plain2Class;
//# sourceMappingURL=typecast.js.map