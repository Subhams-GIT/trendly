import { create_survey_poll } from "../Controller/create_poll_survey";
import * as http from 'http'
import type { customRequest } from "../global";
import { sign_in } from "../Controller/sign_in";
import { bodyParser } from "../middleware/bodyParser";

// har ek url me diff type of data recceive ho sakta hai to i need to have a function which takes the request object and process the body based on the url and method.
export default async function Router(req: customRequest, res: http.ServerResponse) {
    const url = req.url;
    await bodyParser(req);
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
}
