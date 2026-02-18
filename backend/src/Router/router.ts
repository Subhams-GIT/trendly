import { create_survey_poll } from "../Controller/create_poll_survey";
import * as http from 'http'
import authenticate from "../middleware/auth_middleware";
import { type chunk } from "../types/types";
import type { customRequest } from "../global";

export default async  function Router(req: customRequest, res: http.ServerResponse) {
    const url = req.url
    let body:any[]=[];
    let jsonbody:string;
    req.on('data',(chunk:any)=>{
        body.push(chunk)
    })
    .on('end', async ()=>{
        req.body=JSON.parse(Buffer.concat(body).toString());
        switch (url) {
        case '/create':
            create_survey_poll(req, res);
            break;
        
        default:
            res.write("404 not found")
        }
    })   
}