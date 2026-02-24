import { IncomingMessage } from "http"

export interface customRequest extends IncomingMessage{
    body:any,
    user?:{
        id:string,
        name:string,
        email:string,
    },
    queryparams:URLSearchParams
}

export type JWTPayload={
    id:string,
    name:string,
    email:string,
}
