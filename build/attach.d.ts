import { IRoute } from './common';
export declare function attach(expressRouter: any, clss: {
    new (): IRoute;
}): void;
