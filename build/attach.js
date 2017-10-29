"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var class_validator_1 = require("class-validator");
var response = require("./response");
var express = require("express");
function resolveParam(req, routerParam) {
    var paramValue = { exists: false };
    if (routerParam.where === common_1.ParamLocation.Query) {
        if (routerParam.fieldname in req.query) {
            paramValue.exists = true;
            paramValue.value = req.query[routerParam.fieldname];
        }
    }
    else if (routerParam.where === common_1.ParamLocation.Body) {
        if (req.body && routerParam.fieldname in req.body) {
            paramValue.exists = true;
            paramValue.value = req.body[routerParam.fieldname];
        }
    }
    else if (routerParam.where === common_1.ParamLocation.Path) {
        if (routerParam.fieldname in req.params) {
            paramValue.exists = true;
            paramValue.value = req.params[routerParam.fieldname];
        }
    }
    else if (routerParam.where === common_1.ParamLocation.Header) {
        var hv = req.header(routerParam.fieldname);
        if (hv !== null) {
            paramValue.value = hv;
            paramValue.exists = true;
        }
    }
    else if (routerParam.where === common_1.ParamLocation.Cookie) {
        if (req.cookies && routerParam.fieldname in req.cookies) {
            paramValue.exists = true;
            paramValue.value = req.cookies[routerParam.fieldname];
        }
    }
    else if (routerParam.where === common_1.ParamLocation.Request) {
        if (routerParam.fieldname in req) {
            paramValue.exists = true;
            paramValue.value = req[routerParam.fieldname];
        }
    }
    return paramValue;
}
function attach(expressRouter, clss, parent) {
    var meta = common_1.ClassRouterMeta.getOrCreateClassRouterMeta(clss);
    var p = (parent || '') + "." + meta.name;
    if (meta.subRouters && meta.subRouters.length) {
        attachUse(meta, expressRouter, clss, p);
    }
    else {
        attachRoute(meta, expressRouter, clss, p);
    }
    return expressRouter;
}
exports.attach = attach;
function buildInstance(meta, clss, req) {
    var instance = new clss();
    meta.params.each(function (paramMeta) {
        var paramValue = resolveParam(req, paramMeta);
        if (paramValue.exists) {
            if (paramMeta.typecast) {
                instance[paramMeta.propertyname] = paramMeta.typecast(paramValue, paramMeta);
            }
            else {
                instance[paramMeta.propertyname] = paramValue.value;
            }
        }
    });
    return class_validator_1.validate(instance)
        .then(function (errors) {
        if (errors.length > 0) {
            if (meta.validationClass) {
                throw new meta.validationClass(errors);
            }
            throw new common_1.ClassrouterValidationError(errors);
        }
        return instance;
    });
}
function attachUse(meta, expressRouter, clss, parent) {
    var router = express.Router({});
    meta.subRouters.map(function (route) {
        attach(router, route, parent);
    });
    var befores = meta.befores.map(function (fn) {
        return fn();
    });
    var middlewares = meta.middlewares.map(function (it) {
        return function (req, res, next) {
            buildInstance(meta, clss, req)
                .then(function (instance) {
                if (it.methodName in instance) {
                    var fn = instance[it.methodName];
                    var result = fn.call(instance, req, res);
                    return Promise.resolve(result)
                        .then(function (r) {
                        req[it.attachName] = r;
                        next();
                    })
                        .catch(function (err) { return next(err); });
                }
                throw "not found method. method name : " + clss.name + "." + it.methodName + ".";
            })
                .catch(function (err) { return next(err); });
        };
    });
    var handlers = befores.concat(middlewares, [router]);
    var jo = function (path) {
        expressRouter.use(path, handlers);
    };
    meta.getPaths().map(jo);
}
function attachRoute(meta, expressRouter, clss, parent) {
    var handler = function (req, res, next) {
        buildInstance(meta, clss, req)
            .then(function (instance) {
            return instance.action(req, res, next);
        })
            .then(function (result) {
            if (result instanceof response.Response) {
                if (result.contentType)
                    res.set('Content-Type', result.contentType);
                if (result.statusCode)
                    res.status(result.statusCode);
                if (result.headers) {
                    Object.keys(result.headers).map(function (key) {
                        res.set(key, result.headers[key]);
                    });
                }
            }
            if (result instanceof response.View) {
                res.render(result.name, result.data);
            }
            else if (meta.viewName) {
                res.render(meta.viewName, result);
            }
            else if (result instanceof response.Redirect) {
                res.redirect(result.statusCode, result.uri);
            }
            else if (result instanceof response.Raw) {
                res.send(result.body);
            }
            else {
                res.json(result);
            }
        })
            .catch(function (err) {
            next(err);
        });
    };
    var befores = meta.befores.map(function (fn) {
        return fn();
    });
    var middlewares = meta.middlewares.map(function (it) {
        return function (req, res, next) {
            buildInstance(meta, clss, req)
                .then(function (instance) {
                if (it.methodName in instance) {
                    var fn = instance[it.methodName];
                    var result = fn.call(instance, req, res);
                    return Promise.resolve(result)
                        .then(function (r) {
                        req[it.attachName] = r;
                        next();
                    })
                        .catch(function (err) { return next(err); });
                }
                throw "not found method. method name : " + clss.name + "." + it.methodName + ".   ";
            })
                .catch(function (err) { return next(err); });
        };
    });
    var handlers = befores.concat(middlewares, [handler]);
    var jo = function (path) {
        if (meta.method === common_1.HttpMethod.GET) {
            expressRouter.get(path, handlers);
        }
        else if (meta.method === common_1.HttpMethod.POST) {
            expressRouter.post(path, handlers);
        }
        else if (meta.method === common_1.HttpMethod.PUT) {
            expressRouter.put(path, handlers);
        }
        else if (meta.method === common_1.HttpMethod.DELETE) {
            expressRouter.delete(path, handlers);
        }
        else {
            console.log('meta', meta);
            throw new Error("Not supported HttpMethod");
        }
        console.log("attaching: ", parent, path, common_1.HttpMethod[meta.method]);
    };
    meta.getPaths().map(jo);
}
//# sourceMappingURL=attach.js.map