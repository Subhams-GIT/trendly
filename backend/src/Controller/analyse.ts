import type { Request, Response } from "express";
import { dbClient } from "../db/db";
import { question, survey } from "../db/schema";
import { eq, and } from "drizzle-orm";
import analyse_question from "../analysis/analyse";

export async function analyse(req: Request, res: Response) {
  const surveyId = req.query.t as string;
  const userId = req.user?.id;

  if (!userId || !surveyId) {
    res.status(400).json({ message: "Invalid request" });
    return;  
  }

  try {
    const client = dbClient.getInstance();

    const surveyData = await client
      .select()
      .from(survey)
      .where(and(eq(survey.link, surveyId), eq(survey.userId, userId)))
      .limit(1);

    if (surveyData.length === 0) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const questions = await client
      .select()
      .from(question)
      .where(eq(question.surveyId, surveyData[0]?.id as string));


    const results = await Promise.all(
      questions.map(q => {
        console.log(q.question,q.type)
        analyse_question(q.id, q.type)
  })
    );

    res.status(200).json({
      surveyId,
      questions: results,
    });

  } catch (error) {
    console.error("Analysis failed:", error);
    res.status(500).json({ message: "Analysis failed" });
  }
}
