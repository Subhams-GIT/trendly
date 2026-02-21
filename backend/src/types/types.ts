export type chunk=Buffer|Uint8Array<ArrayBufferLike>

export type userJwt={
    userId:string,
    name:string,
}

export interface Question{
    text:string,
    option?:string,
}

export interface Cookie{
    [key:string]:string,
}
