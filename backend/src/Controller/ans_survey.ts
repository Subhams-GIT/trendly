import type { ServerResponse } from "node:http"
import type { customRequest } from "../global"
import { dbClient } from "../db/db";
import { parse } from "node:url";
import { eq } from "drizzle-orm";
import { survey } from "../db/schema";
// /token
export const ans_survey = async (req: customRequest, response: ServerResponse) => {
    try {
        const user = req.user;
        if (!user?.id) return;
        const survey_token = req.queryparams.get("t")
        if (!survey_token) return;

        const client = dbClient.getInstance();
        const survey_found = await client.query.survey.findFirst({
            where: eq(survey.link, survey_token)
        })

        if (!survey_found) {
            return;
        }
        else {
            response.writeHead(200, {
                'content-type': 'application/json'
            })
            response.write(JSON.stringify({
                message: survey_found
            }))
            response.end()
        }
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        response.write(JSON.stringify({
            message: error
        }))
        response.end();
    }
}
