import { ClassRouterMeta, HttpMethod, ParamLocation, ReflectType, IRoute, ClassrouterValidationError, IParamValue, ClassRouterParamMeta } from './common'
import { validate } from "class-validator";



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

export function attach(expressRouter, clss: { new (): IRoute }) {
    let meta = ClassRouterMeta.getOrCreateClassRouterMeta(clss);

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
                res.json(result)
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
            throw new Error("Not supported HttpMethod");
        }

        console.log("attaching", path, HttpMethod[meta.method])
    };

    meta.getPaths().map(jo);
}