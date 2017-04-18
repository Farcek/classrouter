import { ClassRouterMeta, ITypecastFn, ClassType } from './common'
import { plainToClass } from "class-transformer";

function initTypecast(target, propertyKey: string, typecast: ITypecastFn) {
    let meta = ClassRouterMeta.getOrCreateClassRouterMeta(target.constructor);
    let param = meta.getOrCreateClassRouterParamMeta(propertyKey);
    param.typecast = typecast;
}
export function str2int() {
    return (target, propertyKey: string) => {
        initTypecast(target, propertyKey, paramValue => {
            return parseInt(paramValue.value);
        });
    }
}

export function str2Date() {
    return (target, propertyKey: string) => {
        initTypecast(target, propertyKey, paramValue => {
            return new Date(paramValue.value);
        });
    }
}

export function plain2Class<T>(clss: ClassType<T>) {
    return (target, propertyKey: string) => {
        initTypecast(target, propertyKey, (paramValue, paramMeta) => {
            return plainToClass(clss, paramValue.value);
        });
    }
}