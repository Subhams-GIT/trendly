import { eq } from "drizzle-orm";
import { dbClient } from "../db/db";
import { answer, questionOption } from "../db/schema";
import analyse_text from "./analyse_text";


export default async function analyse_question(questionId: string, type: string) {
  if (type === "single") return  analyse_single_question(questionId);
  if (type === "multiple") return analyse_multi_question(questionId);
  if (type === "text") return analyse_text(questionId);
}

export async function analyse_single_question(questionId: string): Promise<Map<string, number>> {
  // kitne logo ne ek particular option ko choose kiya hai wo find out karna hai
  // options and responses
  const client = dbClient.getInstance();
  const responses = await client.query.answer.findMany({
    where: eq(answer.questionId, questionId)
  })
  const options = await client.query.questionOption.findMany({
    where: eq(questionOption.questionId, questionId)
  })
  const final: Map<string, number> = new Map();

  options.forEach((o) => {
    const optionarray = Array.from(o.data as string);
    optionarray.forEach(o => final.set(o, 0))
  });

  responses.map(r => {
    const res = JSON.stringify(r.response)
    final.set(res, (final.get(res) ?? 0) + 1)
  })
  console.log({ final })
  return Promise.resolve(final)
}

export async function analyse_multi_question(questionId: string) {
  const client = dbClient.getInstance();
  const options = await client.query.questionOption.findMany({
    where: eq(questionOption.questionId, questionId),
  });
  const final: Map<string, number> = new Map()
 options.forEach((o) => {
    const optionarray = Array.from(o.data as string);
    optionarray.forEach(o => final.set(o, 0))
  });

  const responses = await client.query.answer.findMany({
    where: eq(answer.questionId, questionId),
  });

  // Count votes
  responses.forEach((r) => {
    // r.response is assumed to be array of selected options
    const selected = Array.isArray(r.response) ? r.response : JSON.parse(r.response as string);
    console.log(selected)
    selected.forEach((opt: string) => {
      final.set(opt, (final.get(opt) ?? 0) + 1);
    });
  });

  console.log(final);
  return Promise.resolve(final);

}
