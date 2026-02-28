import { ServerResponse } from "http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { survey, usersTable, questionOption, question, private_users_survey } from "../db/schema";
import { type question as qu } from "../types/types";
import { eq, inArray } from "drizzle-orm";
import { randomBytes } from "crypto";
type OptionInsert = typeof questionOption.$inferInsert;
import { sendTestEmail } from "../nodemiailer/send";

export async function create_survey(req: customRequest, response: ServerResponse) {
    try {
        const user = req.user;
        if (!user?.id) throw new Error("invaid user ");
        const client = dbClient.getInstance();
        {
            const { title, description, state, visibility, Questions, expiry, allowedUsers } = req.body;
            const link = randomBytes(32).toString("hex");
            const save_survey: typeof survey.$inferInsert = {
                title,
                description,
                userId: user.id,
                expiry: new Date(Date.now() + expiry),
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
                if(visibility==="private" && allowedUsers.length===0) throw new Error("upload users list for privacy!");
                if (visibility === "private" && allowedUsers?.length>0) {

                    const users = await tx
                        .select({ id: usersTable.id, email: usersTable.email })
                        .from(usersTable)
                        .where(inArray(usersTable.email, allowedUsers));

                    if (users.length === 0) {
                        throw new Error("No valid users found");
                    }

                    const allowedEntries = users.map(user => ({
                        surveyId: newSurvey?.id as string,
                        userId: user.id,
                        // token: randomBytes(16).toString("hex")
                    }));
                    await tx.insert(private_users_survey).values(allowedEntries);
                }
                const inserted_Questions = await tx.insert(question).values(
                    questions).returning({ id: question.id, type: question.type, text: question.question })

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
                            data: { ...q.option },
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
            message: "survey created"
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


export const get_Survey = async (req: customRequest, res: ServerResponse) => { // function to get all surveys created by user
    try {
        const userid: string | undefined = req.user?.id;
        // console.log(req.url);
        if (!userid) throw new Error("user not found!");
        const client = dbClient.getInstance();
        const surveys = await client
            .select()
            .from(survey).where(eq(survey.userId, userid))
            .leftJoin(question, eq(question.surveyId, survey.id))
            .fullJoin(questionOption, eq(questionOption.questionId, question.id));
        if (!surveys || surveys.length === 0) {
            res.writeHead(404, {
                "content-type": "application/json"
            });
            res.end(JSON.stringify({ error: "Survey not found" }));
            return;
        }
        res.writeHead(200, {
            "content-type": "application/json"
        })
        res.write(JSON.stringify({
            survey: surveys
        }))
        res.end();
    } catch (error) {
        console.error("poll not created", error);
        res.writeHead(500, {
            message: error as string
        })
        res.write(JSON.stringify({ error }))
        res.end();
    }
}
