import { relations } from "drizzle-orm";
import { survey, Question, option, poll, votes, usersTable } from "./schema";

/* Survey ↔ Question */
export const surveyRelations = relations(survey, ({ many,one }) => ({
  questions: many(Question),
   user: one(usersTable, {
    fields: [survey.userId],
    references: [usersTable.id],
  }),
}));

export const questionRelations = relations(Question, ({ one, many }) => ({
  survey: one(survey, {
    fields: [Question.surveyId],
    references: [survey.id],
  }),
  options: many(option),
}));

/* Question ↔ Option */
export const optionRelations = relations(option, ({ one }) => ({
  question: one(Question, {
    fields: [option.questionId],
    references: [Question.id],
  }),
  poll: one(poll, {
    fields: [option.pollId],
    references: [poll.id],
  }),
}));

/* Poll ↔ Votes */
export const pollRelations = relations(poll, ({ many,one }) => ({
  votes: many(votes),
  user: one(usersTable, {
    fields: [poll.userId],
    references: [usersTable.id],
  }),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  poll: one(poll, {
    fields: [votes.pollId],
    references: [poll.id],
  }),
  option: one(option, {
    fields: [votes.optionId],
    references: [option.id],
  }),
  user:one(usersTable,{
    fields:[votes.userId],
    references:[usersTable.id]
  })
}));

export const userRelations=relations(usersTable,({many})=>({
  surveys:many(survey),
}))

export const user_to_polls=relations(usersTable,({many})=>({
  polls:many(poll)
}))
