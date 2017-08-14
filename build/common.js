"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 1] = "GET";
    HttpMethod[HttpMethod["POST"] = 2] = "POST";
    HttpMethod[HttpMethod["PUT"] = 3] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 4] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
// export enum ContentType {
//     JSON = 1, HTML
// }
var ParamLocation;
(function (ParamLocation) {
    ParamLocation[ParamLocation["Query"] = 0] = "Query";
    ParamLocation[ParamLocation["Path"] = 1] = "Path";
    ParamLocation[ParamLocation["Body"] = 2] = "Body";
    ParamLocation[ParamLocation["Header"] = 3] = "Header";
    ParamLocation[ParamLocation["Cookie"] = 4] = "Cookie";
})(ParamLocation = exports.ParamLocation || (exports.ParamLocation = {}));
var ReflectType = (function () {
    function ReflectType() {
    }
    return ReflectType;
}());
ReflectType.CLASSROUTER = 'design:classrouter';
ReflectType.TYPE = 'design:type';
ReflectType.PARAMETER_TYPE = 'design:paramtypes';
ReflectType.RETURN_TYPE = 'design:returntype';
exports.ReflectType = ReflectType;
var ClassRouterMeta = (function () {
    function ClassRouterMeta(target) {
        this.target = target;
        this._paths = [];
        this.params = new Map();
        this.befores = [];
    }
    ClassRouterMeta.prototype.addPath = function (path) {
        this._paths.push(path);
        return this;
    };
    ClassRouterMeta.prototype.getPaths = function () {
        if (this._paths.length) {
            return this._paths;
        }
        return ["/" + this.name];
    };
    ClassRouterMeta.prototype.getOrCreateClassRouterParamMeta = function (propertyKey) {
        if (this.params.has(propertyKey)) {
            return this.params.get(propertyKey);
        }
        var parammeta = new ClassRouterParamMeta();
        this.params.add(propertyKey, parammeta);
        return parammeta;
    };
    ClassRouterMeta.getOrCreateClassRouterMeta = function (target) {
        if (Reflect.hasMetadata(ReflectType.CLASSROUTER, target)) {
            return Reflect.getMetadata(ReflectType.CLASSROUTER, target);
        }
        var meta = new ClassRouterMeta(target);
        Reflect.defineMetadata(ReflectType.CLASSROUTER, meta, target);
        return meta;
    };
    return ClassRouterMeta;
}());
exports.ClassRouterMeta = ClassRouterMeta;
var ClassRouterParamMeta = (function () {
    function ClassRouterParamMeta() {
    }
    return ClassRouterParamMeta;
}());
exports.ClassRouterParamMeta = ClassRouterParamMeta;
var ClassrouterValidationError = (function () {
    function ClassrouterValidationError(errors) {
        this.errors = errors;
    }
    return ClassrouterValidationError;
}());
exports.ClassrouterValidationError = ClassrouterValidationError;
var Map = (function () {
    function Map() {
        this.items = {};
        this._size = 0;
    }
    Object.defineProperty(Map.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "isEmpty", {
        get: function () {
            return this._size === 0;
        },
        enumerable: true,
        configurable: true
    });
    Map.prototype.add = function (key, value) {
        if (!this.has(key)) {
            this._size++;
        }
        this.items[key] = value;
    };
    Map.prototype.has = function (key) {
        return key in this.items;
    };
    Map.prototype.get = function (key) {
        return this.items[key];
    };
    Map.prototype.remove = function (key) {
        if (this.has(key)) {
            delete this.items[key];
            this._size--;
        }
    };
    Map.prototype.each = function (fn) {
        var keys = Object.keys(this.items);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            fn(this.items[key], key);
        }
    };
    return Map;
}());
exports.Map = Map;
function PromiseSeries(arr, iteratorFn) {
    return arr.reduce(function (p, item) {
        return p.then(function () {
            return iteratorFn(item);
        });
    }, Promise.resolve());
}
exports.PromiseSeries = PromiseSeries;
function PromiseAll(arr, iteratorFn) {
    var promises = arr.map(function (it, index) { return iteratorFn(it, index); });
    return Promise.all(promises);
}
exports.PromiseAll = PromiseAll;
//# sourceMappingURL=common.js.map