

export enum visibility{
    public,
    private
}
export enum state{
    open,
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
    email:string
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
    id:string,
    statement:string,
    userId:string,
    expiry:Date,
    state:"open"|"closed"|"archived",
    visibility:"public"|"private",
    link:string|null,
    createdAt:Date|null
}

export interface vote{
    userId:string,
    pollId:number,
    optionId:number
}

export interface answer{
    questionId:number,
    ans:string
}

export type pollOption={
    id:string,
    data:string,
    pollId:string,
    voteCount:number
}
export type resultant_polls={
    poll:poll,
    poll_option:pollOption|null
}
export type FlatPoll = {
  pollId: string;
  statement: string;
  pollOptionId: string | null;
  optionData: string | null;
  voteCount: number | null;
};

export type NestedPoll = {
  id: string;
  statement: string;
  options: {
    id: string;
    data: string;
    voteCount: number | null;
  }[];
};
