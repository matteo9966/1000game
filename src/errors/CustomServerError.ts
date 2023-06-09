export class CustomServerError extends Error{
    constructor(message:string,public statusCode:number){
        super(message);
    }
}