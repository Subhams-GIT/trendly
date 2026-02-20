import { create_survey_poll } from "../Controller/create_poll_survey";
import * as http from 'http'
import type { customRequest } from "../global";
import { sign_in } from "../Controller/sign_in";

export default async  function Router(req: customRequest, res: http.ServerResponse) {
    const url = req.url
    let body:any[]=[];
    req.on('data',(chunk:any)=>{
        body.push(chunk)
    })
    .on('end', async ()=>{
        req.body=JSON.parse(Buffer.concat(body).toString());
        console.log("body:",req.body);
        switch (url) {
        case '/create':
            create_survey_poll(req, res);
            break;
        case '/sign-in':
            sign_in(req,res);
            break;
        default:
            res.write("404 not found")
        }
    })
}
