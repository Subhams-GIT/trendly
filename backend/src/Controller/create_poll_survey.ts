import { ServerResponse } from "http";
import type { customRequest } from "../global";
import { bodyParser } from "../middleware/bodyParser";
import { dbClient } from "../db/db";
import { survey,Question } from "../db/schema";
import { parseCookies } from "../utils/cookie";
export async function create_survey_poll(req: customRequest, response: ServerResponse) {
    try {
        const isAllowed = await bodyParser(req);
        const client = dbClient.getInstance();
        const { title, description, state, visibility, Questions, expiry } = req.body;
        // const cookies=req.headers.cookie;
        const parsed_cookies = parseCookies(req);
        const doesUserExist = await client.query.usersTable.findFirst({
            with: {
                id: parsed_cookies.id,
            }
        })
        if (!doesUserExist) {
            response.writeHead(500, {
                'content-type': 'application/json'
            })
            response.write(JSON.stringify({
                message: "user not found"
            }))
            response.end()
        }
        else {
            const save_survey: typeof survey.$inferInsert = {
                title,
                description,
                userId: doesUserExist.id,
                expiry,
                state,
                visibility
            };
            const saved=await client.insert(survey).values(save_survey).returning({id:survey.id});
            if(saved.length==0 || !saved[0]) return
            const surveyId=saved[0].id
            await client.insert(Question).values([{surveyId,question:Questions[0]}])
        }
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
