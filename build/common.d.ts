import 'reflect-metadata';
export declare enum HttpMethod {
    GET = 1,
    POST = 2,
    PUT = 3,
    DELETE = 4,
}
export declare enum ParamLocation {
    Query = 0,
    Path = 1,
    Body = 2,
    Header = 3,
    Cookie = 4,
}
export declare class ReflectType {
    static CLASSROUTER: string;
    static TYPE: string;
    static PARAMETER_TYPE: string;
    static RETURN_TYPE: string;
}
export interface ITypecastFn {
    (paramValue: IParamValue, paramMeta: ClassRouterParamMeta): any;
}
export interface IRoute {
    action: (req: any, res: any, next: any) => Promise<any>;
}
export interface IParamOption {
    fieldname?: string;
}
export interface IParamValue {
    exists: boolean;
    value?: any;
}
export declare type ClassType<T> = {
    new (...args: any[]): T;
};
export declare class ClassRouterMeta {
    target: any;
    name: string;
    method: HttpMethod;
    viewName: string;
    params: Map<ClassRouterParamMeta>;
    befores: Function[];
    private _paths;
    constructor(target: any);
    addPath(path: string): this;
    getPaths(): string[];
    getOrCreateClassRouterParamMeta(propertyKey: string): ClassRouterParamMeta;
    static getOrCreateClassRouterMeta(target: any): ClassRouterMeta;
}
export declare class ClassRouterParamMeta {
    propertyname: string;
    fieldname: string;
    propertytype: Function;
    where: ParamLocation;
    typecast: ITypecastFn;
}
export declare class ClassrouterValidationError {
    errors: any;
    constructor(errors: any);
}
export declare class Map<T> {
    private _size;
    private items;
    constructor();
    readonly size: number;
    readonly isEmpty: boolean;
    add(key: string, value: T): void;
    has(key: string): boolean;
    get(key: string): T;
    remove(key: string): void;
    each(fn: (item: T, key: string) => void): void;
}
export declare function PromiseSeries<T>(arr: T[], iteratorFn: (item: T) => Promise<void>): Promise<void>;
export declare function PromiseAll<T, U>(arr: T[], iteratorFn: (item: T, index: number) => Promise<U>): Promise<U[]>;
