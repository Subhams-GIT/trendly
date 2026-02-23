import { create_survey_poll } from "../Controller/create_poll_survey";
import * as http from 'http'
import type { customRequest } from "../global";
import { sign_in } from "../Controller/sign_in";
import { parseCookies } from "../utils/cookie";
import authenticate from "../middleware/auth_middleware";
import { bodyParser } from "../middleware/bodyParser";

// har ek url me diff type of data recceive ho sakta hai to i need to have a function which takes the request object and process the body based on the url and method.
export default async function Router(req: customRequest, res: http.ServerResponse) {
    try {
        const url = req.url;
        if (url!=='/sign-in') {
            const cookies = parseCookies(req);
            const is_authentic = await authenticate(req, cookies);
            console.log({ is_authentic })
            if (!is_authentic) throw new Error("not Authorised");
        }
        await bodyParser(req,res);
        switch (url) {
            case '/create':
                create_survey_poll(req, res);
                break;
            case '/sign-in':
                sign_in(req, res);
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
