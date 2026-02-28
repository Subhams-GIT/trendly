import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { poll, pollOption, private_users_poll, private_users_survey, question, questionOption, survey } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function get_private_surveys(req: customRequest, res: ServerResponse) {
    try { // private -> ?sid=sfs347632gsyd&token=sjdkj346
        const user = req.user;
        if (!user?.id) throw new Error("invalid user");

        const surveyid = req.queryparams.get("sid");
        const usertoken = req.queryparams.get("u");
        if (!surveyid || !usertoken) throw new Error("invalid url");
        const client = dbClient.getInstance();
        const access = await client
            .select()
            .from(private_users_survey)
            .where(
                and(
                    eq(private_users_survey.userId, user.id),
                    eq(private_users_survey.surveyId, surveyid)
                )
            );
        if (!access) throw new Error("accedd denied");

        const res_survey = await client.select().from(survey).where(eq(survey.id, surveyid)).leftJoin(question, eq(question.surveyId, survey.id)).innerJoin(questionOption, eq(questionOption.questionId, question.id));

        if (!res_survey) throw new Error("survey not found");
        res.writeHead(200, {
            'content-type': "application/json"
        })
        res.write(JSON.stringify({
            "survey": res_survey
        }))
    } catch (error) {
        console.error(error);
        res.writeHead(400, {
            "content-type": "application/json"
        })
    }
}


export async function get_private_polls(req: customRequest, res: ServerResponse) {
    try {
        const pollid = req.queryparams.get("p");
        const user_token = req.queryparams.get("u");
        if (!pollid || !user_token) throw new Error("invalid url");
        const client = dbClient.getInstance();
        const is_private_user = await client.query.private_users_poll.findFirst({
            where: eq(private_users_poll.token, user_token)
        })
        if (!is_private_user) {
            throw new Error("invalid user");
        }
        const res_poll = await client.select().from(poll).where(eq(poll.id, pollid)).rightJoin(pollOption, eq(pollOption.pollId, pollid)).rightJoin(private_users_poll, eq(private_users_poll.userId, user_token))

    } catch (error) {

    }
}
