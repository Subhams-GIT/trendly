import { dbClient } from "../db/db";
import { survey, usersTable, questionOption, question, private_users_survey } from "../db/schema";
import { type question as qu } from "../types/types";
import { eq, inArray } from "drizzle-orm";
import { randomBytes } from "crypto";
import type { Request, Response } from "express";
type OptionInsert = typeof questionOption.$inferInsert;


export async function create_survey(req: Request, response: Response) {
    try {
        const user = req.user;
        if (!user?.id) throw new Error("invalid user");

        const client = dbClient.getInstance();
        const { title, description, state, visibility, Questions, expiry, allowedUsers } = req.body;

        const link = randomBytes(32).toString("hex");

        const save_survey: typeof survey.$inferInsert = {
            title,
            description,
            userId: user.id,
            expiry: new Date(Date.now() + expiry * 24 * 60 * 60 * 1000),
            state,
            visibility,
            link
        };

        const token = await client.transaction(async tx => {

            const [newSurvey] = await tx
                .insert(survey)
                .values(save_survey)
                .returning({ id: survey.id, token: survey.link });

            const questions: typeof question.$inferInsert[] = Questions.map((q: qu) => ({
                question: q.statement,
                surveyId: newSurvey?.id,
                type: q.type
            }));

            if (visibility === "private" && (!allowedUsers || allowedUsers.length === 0)) {
                throw new Error("upload users list for privacy!");
            }

            if (visibility === "private" && allowedUsers?.length > 0) {

                const users = await tx
                    .select({ id: usersTable.id, email: usersTable.email })
                    .from(usersTable)
                    .where(inArray(usersTable.email, allowedUsers));

                if (users.length === 0) {
                    throw new Error("No valid users found");
                }

                const allowedEntries = users.map(user => ({
                    surveyId: newSurvey?.id as string,
                    userId: user.id
                }));

                await tx.insert(private_users_survey).values(allowedEntries);
            }

            const insertedQuestions = await tx
                .insert(question)
                .values(questions)
                .returning({
                    id: question.id,
                    type: question.type,
                    text: question.question
                });

            // filter non-text questions
            const optionQuestions = insertedQuestions.filter(q => q.type !== "text");

            let options: OptionInsert[] = [];

            if (optionQuestions.length > 0) {
                Questions.forEach((q: qu) => {

                    if (q.type.toString() === "text") return;

                    const res = optionQuestions.find(oq =>
                        oq.text === q.statement
                    );

                    if (res && q.option) {
                        options.push({
                            data: { ...q.option },
                            questionId: res.id
                        });
                    }
                });

                if (options.length > 0) {
                    await tx.insert(questionOption).values(options);
                }
            }

            return newSurvey?.token;
        });

        response.json({
            message: "survey created",
            link: token
        });

    } catch (error) {
        console.error(error);
        response.status(400).json({
            error
        });
    }
}


export const get_Survey = async (req: Request, res: Response) => { // function to get all surveys created by user
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
        res.json({
            survey
        })
    } catch (error) {
        console.error("poll not created", error);
        res.status(400).json({
            error
        })
    }
}
