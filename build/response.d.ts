export declare class Response {
    contentType: string;
    statusCode: number;
    headers: {
        [key: string]: string;
    };
}
export declare class View extends Response {
    name: string;
    data: any;
    constructor(name: string, data: any);
}
export declare class Redirect extends Response {
    uri: string;
    constructor(uri: string, code?: number);
}
export declare class Raw extends Response {
    body: string;
    constructor(contentType: string, body: string);
}
