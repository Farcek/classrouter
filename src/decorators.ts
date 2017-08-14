import { ClassRouterMeta, HttpMethod, ParamLocation, ReflectType } from './common'

function initMethod(target: Function, method: HttpMethod) {
    let meta = ClassRouterMeta.getOrCreateClassRouterMeta(target);
    meta.name = target.name;
    meta.method = method;
}
export function GET(target: Function) {
    initMethod(target, HttpMethod.GET);
}
export function POST(target: Function) {
    initMethod(target, HttpMethod.POST);
}

export function PUT(target: Function) {
    initMethod(target, HttpMethod.PUT);
}

export function DELETE(target: Function) {
    initMethod(target, HttpMethod.DELETE);
}

export function before(...middlewares: Function[]) {
    return (target: Function) => {
        let meta = ClassRouterMeta.getOrCreateClassRouterMeta(target);
        middlewares.forEach(it => meta.befores.push(it));
    }
}

export function view(name: string) {
    return (target: Function) => {
        let meta = ClassRouterMeta.getOrCreateClassRouterMeta(target);
        meta.viewName = name;
    }
}

export function PATH(...paths: string[]) {
    return (target) => {
        let meta = ClassRouterMeta.getOrCreateClassRouterMeta(target);
        for (let path of paths) {
            meta.addPath(path);
        }
    }
}

function initParam(target, propertyKey: string, fieldname: string, location: ParamLocation) {
    let meta = ClassRouterMeta.getOrCreateClassRouterMeta(target.constructor);
    let param = meta.getOrCreateClassRouterParamMeta(propertyKey)
    param.propertyname = propertyKey;
    param.propertytype = Reflect.getMetadata(ReflectType.TYPE, target, propertyKey);
    param.where = location;
    param.fieldname = fieldname || propertyKey;
}
export function QueryParam(fieldname?: string) {
    return (target, propertyKey: string) => initParam(target, propertyKey, fieldname, ParamLocation.Query)
}

export function PathParam(fieldname?: string) {
    return (target, propertyKey: string) => initParam(target, propertyKey, fieldname, ParamLocation.Path)
}
export function BodyParam(fieldname?: string) {
    return (target, propertyKey: string) => initParam(target, propertyKey, fieldname, ParamLocation.Body)
}
export function CookieParam(fieldname?: string) {
    return (target, propertyKey: string) => initParam(target, propertyKey, fieldname, ParamLocation.Cookie)
}
export function HeaderParam(fieldname?: string) {
    return (target, propertyKey: string) => initParam(target, propertyKey, fieldname, ParamLocation.Header)
}