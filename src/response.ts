
export class Response {
    contentType: string
    statusCode: number 
    headers: { [key: string]: string }

}
export class View extends Response {
    constructor(public name: string, public data: any) {
        super();
        this.contentType = 'text/html';
    }
}

export class Redirect extends Response {
    constructor(public uri: string, code = 301) {
        super();
        this.statusCode = code;
    }
}

export class Raw extends Response {

    constructor(contentType: string, public body: string) {
        super();
        if (contentType) this.contentType = contentType;
    }
}

export class File extends Response {

    constructor(public filepath: string) {
        super();        
    }
}