import type { ServerResponse } from "node:http"
import type { customRequest } from "../global"
import { dbClient } from "../db/db";
import { eq } from "drizzle-orm";
import { survey, surveySubmission,answer } from "../db/schema";
import type { answer as a} from "../types/types";
export const ans_survey = async (req: customRequest, res: ServerResponse) => {
    try {
        const user = req.user;
        if (!user?.id) return;
        const survey_token = req.queryparams.get("t")
        if (!survey_token) return;
        const { ans } = req.body;
        const client = dbClient.getInstance();
        const survey_found = await client.query.survey.findFirst({
            where: eq(survey.link, survey_token)
        })

        if (!survey_found || survey_found.state != "open") {
            res.writeHead(500);
            res.write(JSON.stringify({
                message: "survey error"
            }))
            res.end();
            return;
        }
        else {

            await client.transaction(async tx => {
                const submission = await tx.insert(surveySubmission).values({ surveyId: survey_found.id, userId: user.id, submittedAt: new Date() }).returning({ id: surveySubmission.id });
                if (!submission) throw new Error("not submitted");
                let answers: typeof answer.$inferInsert[] = ans.map((a:a) => ({
                    submissionId: submission[0]?.id,
                    questionId: a.questionId,
                    response: a.ans
                }))
                await tx.insert(answer).values(answers);

            })
            res.writeHead(200, {
                'content-type': 'application/json'
            })
            res.write(JSON.stringify({
                message: "submitted"
            }))
            res.end()
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.write(JSON.stringify({
            message: error
        }))
        res.end();
    }
}
