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
function attachUse(meta, expressRouter, clss, parent) {
    var router = express.Router();
    meta.subRouters.map(function (route) {
        attach(router, route, parent);
    });
    var befores = meta.befores.map(function (fn) {
        return fn();
    });
    var handlers = [].concat(befores, [router]);
    var jo = function (path) {
        expressRouter.use(path, handlers);
    };
    meta.getPaths().map(jo);
}
function attachRoute(meta, expressRouter, clss, parent) {
    var handler = function (req, res, next) {
        var instance = new clss();
        //
        meta.params.each(function (paramMeta) {
            var paramValue = resolveParam(req, paramMeta);
            if (paramValue.exists) {
                //console.log(paramMeta.propertyname, paramValue)
                if (paramMeta.typecast) {
                    instance[paramMeta.propertyname] = paramMeta.typecast(paramValue, paramMeta);
                }
                else {
                    instance[paramMeta.propertyname] = paramValue.value;
                }
            }
        });
        class_validator_1.validate(instance)
            .then(function (errors) {
            if (errors.length > 0) {
                throw new common_1.ClassrouterValidationError(errors);
            }
            return instance.action(req, res, next);
        })
            .then(function (result) {
            if (result instanceof response.View) {
                res.render(result.name, result.data);
            }
            else if (result instanceof response.Redirect) {
                res.redirect(result.code, result.uri);
            }
            else if (meta.viewName) {
                res.render(meta.viewName, result);
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
    var handlers = [].concat(befores, [handler]);
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