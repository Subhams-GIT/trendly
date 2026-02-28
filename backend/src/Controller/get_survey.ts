import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { dbClient } from "../db/db";
import { private_users_survey, question, questionOption, survey, usersTable } from "../db/schema";
import { ConsoleLogWriter, eq } from "drizzle-orm";

export const get_specific_Survey = async (req: customRequest, res: ServerResponse) => { // function to get all surveys
    try {
        // fetch the survey first
        // check for visibility
        // if public normally return it
        // else if private then check whether user is allowed to see it or not

        const survey_token = req.params?.token;
        if (!survey_token) throw new Error("invalid url");
        const user = req.user;
        if(!user) throw new Error("invalid user")
        const client=dbClient.getInstance();
        const foundSurvey = await client
            .select()
            .from(survey)
            .where(eq(survey.link, survey_token));

        if (!foundSurvey || foundSurvey.length === 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ error: "Survey not found" }));
            return;
        }

        const surveyData = foundSurvey[0];
        if(surveyData?.state==="closed") throw new Error("survey is no more valid");
        if(surveyData?.visibility!="public"){
            const private_list=await client.query.private_users_survey.findFirst({
                where:eq(private_users_survey.userId,user?.id as string)
            })
            console.log(private_list);
            console.log(user)
            if(private_list?.userId!=user.id) throw new Error("user not allowed!")
        }
        const surveys = await client
            .select({
                surveyId: survey.id,
                title: survey.title,
                description: survey.description,
                expiry: survey.expiry,
                state: survey.state,
                visibility: survey.visibility,
                questionId: question.question,
                questionText: question.question,
                optionId: questionOption.id,
                optionText: questionOption.data
            })
            .from(survey)
            .leftJoin(question, eq(question.surveyId, survey.id))
            .leftJoin(questionOption, eq(questionOption.questionId, question.id))
            .where(eq(survey.link, survey_token));

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ survey: surveys }));
    } catch (error) {
        console.error("survey error", error);
        res.writeHead(500, {
            message: error as string
        })
        res.write(JSON.stringify({ error }))
        res.end();
    }
}
