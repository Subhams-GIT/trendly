import { ServerResponse } from "http";
import type { customRequest } from "../global";
export async function create_survey_poll(req: customRequest, response: ServerResponse) {
    try {
        // const body = await JSON.parse(req.body);
        // console.log(typeof body)
        console.log(req.body);
        response.writeHead(200, {
            'content-type': 'application/json'
        })
        response.write(JSON.stringify({
            message: "poll created"
        }))
        response.end()
    } catch (error) {
        return
    }
}