import { ServerResponse } from "http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { survey, usersTable, questionOption, question } from "../db/schema";
import { type question as qu, type option } from "../types/types";
import { eq, type InferInsertModel } from "drizzle-orm";
import { randomBytes } from "crypto";
type OptionInsert = typeof questionOption.$inferInsert;
type QuestionInsert = InferInsertModel<typeof question>;

export async function create_survey_poll(req: customRequest, response: ServerResponse) {
    try {
        const client = dbClient.getInstance();
        const { title, description, state, visibility, Questions, expiry } = req.body;
        console.log({ body: req.body })
        const doesUserExist = await client.query.usersTable.findFirst({
            where: eq(usersTable.id, req.user?.id as string)
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
            const link = randomBytes(32).toString("hex");
            const save_survey: typeof survey.$inferInsert = {
                title,
                description,
                userId: doesUserExist.id,
                expiry: new Date(),
                state,
                visibility,
                link
            };

            await client.transaction(async tx => {
                const [newSurvey] = await tx.insert(survey).values(save_survey).returning({ id: survey.id });
                const questions: typeof question.$inferInsert = Questions.map((q: qu) => ({
                    question: q.statement,
                    surveyId: newSurvey?.id,
                    type: q.type,
                }))

                const inserted_Questions = await tx.insert(question).values(
                    questions).returning({ id: question.id, type: question.type, text: question.question })

                // const options_to_insert:OptionInsert[] = inserted_Questions
                //     .filter(q => q.type === "multi" || q.type === "single")
                //     .flatMap(q => {
                //         const original = Questions.find((i: qu) => i.statement === q.text);
                //         return original?.options?.map((opt: any) => ({
                //             questionId: q.id,
                //             value: opt.value,
                //         })) ?? [];
                //     });
                console.log(inserted_Questions);
                const options_questions = inserted_Questions.filter(iq =>
                    iq.type !== "text"
                );

                let options: OptionInsert[] = [];

                Questions.forEach((q: qu) => {
                    const current_question = q.statement;
                    const res = options_questions.find(oq =>
                        oq.text === current_question
                    );
                    if (res) {
                        options.push({
                            data: {...q.option},
                            questionId: res.id
                        });
                    }
                });
                await tx.insert(questionOption).values(options);
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
        response.write(JSON.stringify({
            message: error
        }))
        response.end();
    }
}
