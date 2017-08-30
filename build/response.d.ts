export declare class View {
    name: string;
    data: any;
    constructor(name: string, data: any);
}
export declare class Redirect {
    uri: string;
    code: number;
    constructor(uri: string, code?: number);
}
