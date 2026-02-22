import type { SQLiteTimestamp } from "drizzle-orm/sqlite-core"

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
    single_option,
    multiple_option
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
    text:string,
    question_id:number,
    vote_count:number,

}

export interface question{
    statement:string,
    survey_id:string,
    option?:option
    type:type_question
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
