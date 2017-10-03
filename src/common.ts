import 'reflect-metadata'

export enum HttpMethod {
    GET = 1, POST, PUT, DELETE
}

// export enum ContentType {
//     JSON = 1, HTML
// }

export enum ParamLocation {
    Query, Path, Body, Header, Cookie
}

export class ReflectType {
    static CLASSROUTER: string = 'design:classrouter';
    static TYPE: string = 'design:type';
    static PARAMETER_TYPE: string = 'design:paramtypes';
    static RETURN_TYPE: string = 'design:returntype';
}

export interface ITypecastFn {
    (paramValue: IParamValue, paramMeta: ClassRouterParamMeta): any
}

export interface IRoute {
    action: (req: any, res: any, next: any) => Promise<any>
}

export interface IParamOption {

    fieldname?: string
}

export interface IParamValue {
    exists: boolean
    value?: any
}


export declare type ClassType<T> = {
    new (...args: any[]): T;
};


export class ClassRouterMeta {

    name: string
    method: HttpMethod
    viewName: string

    params: Map<ClassRouterParamMeta>
    befores: Function[] = []
    subRouters: ClassType<IRoute>[] = []

    private _paths: string[] = [];




    constructor(public target) {        
        this.params = new Map<ClassRouterParamMeta>()        
    }


    public addPath(path: string) {
        this._paths.push(path);
        return this;
    }

    public getPaths() {
        if (this._paths.length) {
            return this._paths;
        }

        return [`/${this.name}`]

    }

    getOrCreateClassRouterParamMeta(propertyKey: string): ClassRouterParamMeta {
        if (this.params.has(propertyKey)) {
            return this.params.get(propertyKey);
        }

        let parammeta = new ClassRouterParamMeta();
        this.params.add(propertyKey, parammeta);
        return parammeta;
    }




    static getOrCreateClassRouterMeta(target): ClassRouterMeta {

        if (Reflect.hasMetadata(ReflectType.CLASSROUTER, target)) {
            return Reflect.getMetadata(ReflectType.CLASSROUTER, target);
        }

        let meta = new ClassRouterMeta(target);
        meta.name = target.name;
        Reflect.defineMetadata(ReflectType.CLASSROUTER, meta, target);
        return meta;
    }
}


export class ClassRouterParamMeta {
    propertyname: string
    fieldname: string
    propertytype: Function
    where: ParamLocation


    typecast: ITypecastFn
}


export class ClassrouterValidationError {
    constructor(public errors) {

    }
}


export class Map<T> {
    private _size: number;
    private items: { [key: string]: T };

    constructor() {
        this.items = {};
        this._size = 0;
    }

    get size() {
        return this._size;
    }

    get isEmpty() {
        return this._size === 0;
    }


    add(key: string, value: T): void {

        if (!this.has(key)) {
            this._size++;
        }
        this.items[key] = value;
    }

    has(key: string): boolean {
        return key in this.items;
    }

    get(key: string): T {
        return this.items[key];
    }
    remove(key: string): void {
        if (this.has(key)) {
            delete this.items[key];
            this._size--;
        }
    }

    each(fn: (item: T, key: string) => void) {
        let keys = Object.keys(this.items);
        for (let key of keys) {
            fn(this.items[key], key);
        }
    }
}

export function PromiseSeries<T>(arr: T[], iteratorFn: (item: T) => Promise<void>): Promise<void> {
    return arr.reduce((p, item) => {
        return p.then(() => {
            return iteratorFn(item);
        });
    }, Promise.resolve());
}

export function PromiseAll<T, U>(arr: T[], iteratorFn: (item: T, index: number) => Promise<U>): Promise<U[]> {
    let promises = arr.map((it, index) => iteratorFn(it, index));
    return Promise.all(promises)
}






