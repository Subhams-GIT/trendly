import { create_survey, get_Survey } from "../Controller/create_poll_survey";
import * as http from 'http'
import type { customRequest } from "../global";
import { sign_in } from "../Controller/sign_in";
import { parseCookies } from "../utils/cookie";
import authenticate from "../middleware/auth_middleware";
import { bodyParser } from "../middleware/bodyParser";
import { create_poll } from "../Controller/create_poll";
import u from "url";
import { ans_survey } from "../Controller/ans_survey";
import { get_polls } from "../Controller/get_all_polls";
import { getPoll } from "../Controller/get_poll";
import { get_specific_Survey } from "../Controller/get_survey";
// har ek url me diff type of data recceive ho sakta hai to i need to have a function which takes the request object and process the body based on the url and method.
export default async function Router(req: customRequest, res: http.ServerResponse) {
    try {
        console.log(typeof req.url)
        if (!req.url) throw new Error("url not found!");
        const url = u.parse(req.url)
        const searchParams = new URLSearchParams(url.query ?? "");
        req.queryparams = searchParams;
        if (url?.pathname !== '/sign-in') {
            const cookies = parseCookies(req);
            const is_authentic = await authenticate(req, cookies);
            if (!is_authentic) throw new Error("not Authorised");
        }
        await bodyParser(req, res);
        switch (true) {
            case url?.pathname === '/create-survey':
                create_survey(req, res);
                break;

            case url?.pathname === '/sign-in':
                sign_in(req, res);
                break;

            case url?.pathname === '/create-poll':
                create_poll(req, res);
                break;
            case url.pathname==='/surveys':
                get_Survey(req,res);
                break;

            case url?.pathname?.startsWith('/survey'):
                const surveytoken=url.query?.split('=')[1];
                req.params={token:surveytoken as string}
                get_specific_Survey(req, res);
                break;

            case url?.pathname === '/polls':
                get_polls(req, res);
                break;

            case url?.pathname === '/submit_survey':
                ans_survey(req, res);
                break;

            case url?.pathname?.startsWith('/poll/'):
                const pollId = url.pathname?.split('/')[2];
                req.params = { id: pollId as string };
                getPoll(req, res);
                break;

            default:
                res.writeHead(404, {
                    "content-type": "application/json"
                });
                res.end(JSON.stringify({ message: "404 not found" }));
        }
        } catch (error) {
            res.writeHead(400, {
                "content-type": "application/json"
            })
            res.write(JSON.stringify({
                message: error
            }))
            res.end();
        }
    }
