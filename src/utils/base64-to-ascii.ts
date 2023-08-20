import { Buffer } from "buffer";

export function B64ToASCII(data:string){
    try {
        return Buffer.from(data,'base64').toString('ascii');
    } catch (error) {
        return null
    }

}