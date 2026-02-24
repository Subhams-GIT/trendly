

export enum visibility{
    public,
    private
}
export enum state{
    open,
    closed,
    archieved
}
export enum voteMode{
    anonymous,
    authenticated
}

export enum type_question{
    text,
    single,
    multiple
}
export type chunk=Buffer|Uint8Array<ArrayBufferLike>

export type userJwt={
    userId:string,
    name:string,
}

export interface Cookie{
    [key:string]:string,
}
export interface option{
    data:string,
    questionId:string,
}

export interface question{
    statement:string,
    survey_id:string,
    type:type_question,
    option?:option[]
}


export interface poll{
    statement:string,
    user_id:string,
    expiry:number,
    state:state,
    visibility:visibility,
    voteMode:voteMode,
}

export interface vote{
    userId:string,
    pollId:number,
    optionId:number
}

export interface answer{
    userId:string,
    questionId:number,
    response:string
}

export type pollOption={
    data:string,
    pollId:string,
}
