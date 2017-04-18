import { ClassType } from './common';
export declare function str2int(): (target: any, propertyKey: string) => void;
export declare function str2Date(): (target: any, propertyKey: string) => void;
export declare function plain2Class<T>(clss: ClassType<T>): (target: any, propertyKey: string) => void;
