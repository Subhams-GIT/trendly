import { ServerResponse } from "http";
import type { customRequest } from "../global";
import { bodyParser } from "../middleware/bodyParser";
import { dbClient } from "../db/db";
import { survey, Question, option as Option, usersTable } from "../db/schema";
import { parseCookies } from "../utils/cookie";
import { type question } from "../types/types";
import { eq, type InferInsertModel } from "drizzle-orm";
type OptionInsert = InferInsertModel<typeof Option>;
type QuestionInsert = InferInsertModel<typeof Question>;

export async function create_survey_poll(req: customRequest, response: ServerResponse) {
    try {
        const isAllowed = await bodyParser(req);
        const client = dbClient.getInstance();
        const { title, description, state, visibility, Questions, expiry } = req.body;
        // const cookies=req.headers.cookie;
        const parsed_cookies = parseCookies(req);
        const doesUserExist = await client.query.usersTable.findFirst({
            where: eq(usersTable.id, parsed_cookies.id!)
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
            const options: QuestionInsert = Questions.map((q: question) => ({
                question: q.statement,
                surveyId: save_survey.id,
                type: q.type,
            }))
            await client.transaction(async tx => {
                const [newSurvey] = await tx.insert(survey).values(save_survey).returning();
                const inserted_Questions = await tx.insert(Question).values(
                    Questions).returning()

                const optionsValues: OptionInsert[] = inserted_Questions.flatMap(
                    (insertedQ, index) =>
                        Questions[index].option?.map((opt: string) => ({
                            data: opt,
                            questionId: insertedQ.id,
                        })) ?? []
                );

                if (optionsValues.length > 0) {
                    await tx.insert(Option).values(optionsValues);
                }
            })

        }
        response.writeHead(200, {
            'content-type': 'application/json'
        })
        response.write(JSON.stringify({
            message: "poll created"
        }))
        response.end()
    } catch (error) {
        console.error(error);
        response.writeHead(500);
        response.end();
    }
}
