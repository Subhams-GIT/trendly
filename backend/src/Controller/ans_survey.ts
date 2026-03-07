import { dbClient } from "../db/db";
import { eq } from "drizzle-orm";
import { survey, surveySubmission, answer, private_users_survey } from "../db/schema";
import type { answer as a } from "../types/types";
import type { Request, Response } from "express";
export const ans_survey = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) return;
        const survey_token = req.query["t"]
        if (!survey_token) return;
        const { ans } = req.body;
        console.log("body", req.body)
        /*
        response->{
            questionid:string,
            answer:string,

        }
        */
        const client = dbClient.getInstance();
        const survey_found = await client.query.survey.findFirst({
            where: eq(survey.link, survey_token as string)
        })

        console.log("snnfn")
        if (!survey_found || survey_found.state != "open") {
            res.json({
                message: "survey closed"
            })
            return;
        }
        if (survey_found.expiry && survey_found.expiry < new Date()) {
            res.json({
                message: "survey expired!"
            })
            return;
        }
        if (survey_found?.visibility != "public") {
            const is_user_allowed = await client.query.private_users_survey.findFirst({
                where: eq(private_users_survey.userId, user.id)
            })
            if (!is_user_allowed) {
                throw new Error("you are not allwed to give the survey")
            }
        }
            console.log("answer reached!")
            await client.transaction(async tx => {
                const submission = await tx.insert(surveySubmission).values({ surveyId: survey_found.id, userId: user.id, submittedAt: new Date() }).returning({ id: surveySubmission.id });
                if (!submission) return new Error("not submitted");

                let answers: typeof answer.$inferInsert[] = ans.map((a: a) => ({
                    submissionId: submission[0]?.id,
                    questionId: a.questionId,
                    response: a.ans
                }))
                return await tx.insert(answer).values(answers);

            })
            res.json({
                message: "submitted"
            })
        }
     catch (error) {
        console.error(error);
        res.json({
            error: error
        })
    }
}
