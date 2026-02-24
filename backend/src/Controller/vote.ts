// vote -> identify using the link
// public -> generate a url which encodees the creator data
// private -> generate a token or use regex for checking the user

import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";

export async function vote(req:customRequest,res:ServerResponse){
    try {
        const {}=req.body;
    } catch (error) {
        
    }

}
