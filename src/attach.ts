import { ClassRouterMeta, HttpMethod, ParamLocation, ReflectType, ClassType, IRoute, ClassrouterValidationError, IParamValue, ClassRouterParamMeta } from './common'
import { validate } from "class-validator";
import * as response from "./response";
import * as express from "express";


function resolveParam(req, routerParam: ClassRouterParamMeta) {

    let paramValue: IParamValue = { exists: false }
    if (routerParam.where === ParamLocation.Query) {
        if (routerParam.fieldname in req.query) {
            paramValue.exists = true;
            paramValue.value = req.query[routerParam.fieldname];
        }
    } else if (routerParam.where === ParamLocation.Body) {
        if (req.body && routerParam.fieldname in req.body) {
            paramValue.exists = true;
            paramValue.value = req.body[routerParam.fieldname];
        }
    } else if (routerParam.where === ParamLocation.Path) {
        if (routerParam.fieldname in req.params) {
            paramValue.exists = true;
            paramValue.value = req.params[routerParam.fieldname];
        }
    } else if (routerParam.where === ParamLocation.Header) {
        let hv = req.header(routerParam.fieldname);
        if (hv !== null) {
            paramValue.value = hv;
            paramValue.exists = true;
        }

    } else if (routerParam.where === ParamLocation.Cookie) {
        if (req.cookies && routerParam.fieldname in req.cookies) {
            paramValue.exists = true;
            paramValue.value = req.cookies[routerParam.fieldname]
        }
    }

    return paramValue;
}

export function attach(expressRouter: any, clss: { new (): IRoute | any }, parent?: string) {
    let meta = ClassRouterMeta.getOrCreateClassRouterMeta(clss);    
    let p = `${parent || ''}.${meta.name}`;
    if (meta.subRouters && meta.subRouters.length) {
        attachUse(meta, expressRouter, <{ new (): any }>clss, p);
    } else {
        attachRoute(meta, expressRouter, <{ new (): IRoute }>clss, p);
    }

    return expressRouter;
}

function attachUse(meta: ClassRouterMeta, expressRouter: any, clss: { new (): any }, parent?: string) {

    var router = express.Router();

    meta.subRouters.map(route => {
        attach(router, route, parent)
    });


    let befores = meta.befores.map(fn => {
        return fn();
    });

    let handlers = [].concat(befores, [router]);

    let jo = (path) => {
        expressRouter.use(path, handlers);
    };

    meta.getPaths().map(jo);
}

function attachRoute(meta: ClassRouterMeta, expressRouter: any, clss: { new (): IRoute }, parent?: string) {
    let handler = (req, res, next) => {
        let instance = new clss();

        //


        meta.params.each(paramMeta => {
            let paramValue = resolveParam(req, paramMeta);
            if (paramValue.exists) {
                //console.log(paramMeta.propertyname, paramValue)

                if (paramMeta.typecast) {
                    instance[paramMeta.propertyname] = paramMeta.typecast(paramValue, paramMeta);
                } else {
                    instance[paramMeta.propertyname] = paramValue.value
                }

            }
        });

        validate(instance)
            .then(errors => {
                if (errors.length > 0) {
                    throw new ClassrouterValidationError(errors);
                }
                return instance.action(req, res, next)
            })
            .then(result => {
                if (result instanceof response.View) {
                    res.render(result.name, result.data);
                } else if (result instanceof response.Redirect) {
                    res.redirect(result.code, result.uri);
                } else if (meta.viewName) {
                    res.render(meta.viewName, result);
                } else {
                    res.json(result)
                }
            })
            .catch(err => {
                next(err)
            })
    };

    let befores = meta.befores.map(fn => {
        return fn();
    });

    let handlers = [].concat(befores, [handler]);

    let jo = (path) => {
        if (meta.method === HttpMethod.GET) {
            expressRouter.get(path, handlers);
        } else if (meta.method === HttpMethod.POST) {
            expressRouter.post(path, handlers);
        } else if (meta.method === HttpMethod.PUT) {
            expressRouter.put(path, handlers);
        } else if (meta.method === HttpMethod.DELETE) {
            expressRouter.delete(path, handlers);
        } else {
            console.log('meta', meta)
            throw new Error("Not supported HttpMethod");
        }

        console.log("attaching: ", parent, path, HttpMethod[meta.method])
    };

    meta.getPaths().map(jo);
}