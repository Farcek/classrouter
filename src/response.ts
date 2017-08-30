export class View{
    constructor(public name:string, public data:any){

    }
}

export class Redirect{
    constructor(public uri:string, public code = 301){

    }
}