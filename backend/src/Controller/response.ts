import { type Request, type Response } from "express";
import { dbClient } from "../db/db";
import { answer, question, survey, surveySubmission, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";


export default async function response_survey(req: Request, res: Response) { // get response of a particular survey
    const id = req.query.t;
    if (!id) return;
    const user = req.user;
    if (!id) return
    if (!user?.id || !id) return;
    try {
        const client = dbClient.getInstance();
        const res_survey = await client.select({ id: survey.id }).from(survey).where(eq(survey.link, id as string))
        const responses = await client
            .select({
                surveyId:surveySubmission.surveyId,
                questionId:question.id,
                username:usersTable.name,
                questionText: question.question,
                response: answer.response,
            })
            .from(surveySubmission)
            .innerJoin(answer, eq(answer.submissionId, surveySubmission.id))
            .innerJoin(question, eq(answer.questionId, question.id))
            .innerJoin(usersTable, eq(usersTable.id, surveySubmission.userId))
            .where(eq(surveySubmission.surveyId, res_survey[0]?.id as string));
            

        res.json({
            responses
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: "error occured while quering data"
        })
    }

}
