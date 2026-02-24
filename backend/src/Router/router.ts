import { create_survey_poll, get_Survey } from "../Controller/create_poll_survey";
import * as http from 'http'
import type { customRequest } from "../global";
import { sign_in } from "../Controller/sign_in";
import { parseCookies } from "../utils/cookie";
import authenticate from "../middleware/auth_middleware";
import { bodyParser } from "../middleware/bodyParser";
import { create_poll } from "../Controller/create_poll";
import u from "url";
import { ans_survey } from "../Controller/ans_survey";
// har ek url me diff type of data recceive ho sakta hai to i need to have a function which takes the request object and process the body based on the url and method.
export default async function Router(req: customRequest, res: http.ServerResponse) {
    try {
        console.log(typeof req.url)
        if (!req.url) throw new Error("url not found!");
        const url = u.parse(req.url)
        console.log(url.query);
        const searchParams = new URLSearchParams(url.query??"");
        req.queryparams=searchParams;
        if (url?.pathname !== '/sign-in') {
            const cookies = parseCookies(req);
            const is_authentic = await authenticate(req, cookies);
            if (!is_authentic) throw new Error("not Authorised");
        }
        await bodyParser(req, res);
        switch (url?.pathname) {
            case '/create':
                create_survey_poll(req, res);
                break;
            case '/sign-in':
                sign_in(req, res);
                break;
            case '/create-poll':
                create_poll(req, res);
                break;
            case '/surveys':
                get_Survey(req, res);
                break;
            case '/submit_survey':
                ans_survey(req,res);
                break;
            default:
                res.write("404 not found")
                res.end();
        }
    } catch (error) {
        res.writeHead(400, {
            "content-type": "application/json"
        })
        res.write(JSON.stringify({
            message: error
        }))
    }
}
