import type { Request, Response } from "express";
import { dbClient } from "../db/db";
import { poll, pollOption, private_users_poll, private_users_survey, question, questionOption, survey } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function get_private_surveys(req: Request, res: Response) {
    try { // private -> ?sid=sfs347632gsyd&token=sjdkj346
        const user = req.user;
        if (!user?.id) throw new Error("invalid user");

        const surveyid = req.query.sid
        const usertoken = req.query.u;
        if (!surveyid || !usertoken) throw new Error("invalid url");
        const client = dbClient.getInstance();
        const access = await client
            .select()
            .from(private_users_survey)
            .where(
                and(
                    eq(private_users_survey.userId, user.id),
                    eq(private_users_survey.surveyId, surveyid as string)
                )
            );
        if (!access) throw new Error("access denied");

        const res_survey = await client.select().from(survey).where(eq(survey.id, surveyid as string)).leftJoin(question, eq(question.surveyId, survey.id)).innerJoin(questionOption, eq(questionOption.questionId, question.id));

        if (!res_survey) throw new Error("survey not found");
        res.json({
            message:res_survey
        })
    } catch (error) {
        console.error(error);
        res.json({
            error
        })
    }
}


export async function get_private_polls(req: Request, res: Response) {
    try {
        const pollid = req.query.p;
        const user_token = req.query.u;
        if (!pollid || !user_token) throw new Error("invalid url");
        const client = dbClient.getInstance();
        const is_private_user = await client.query.private_users_poll.findFirst({
            where: eq(private_users_poll.token, user_token as string)
        })
        if (!is_private_user) {
            throw new Error("invalid user");
        }
        const res_poll = await client.select().from(poll).where(eq(poll.id, pollid as string)).rightJoin(pollOption, eq(pollOption.pollId, pollid as string)).rightJoin(private_users_poll, eq(private_users_poll.userId, user_token as string))

    } catch (error) {
        res.json({
            message:"error ocurred!"
        })
    }
}
