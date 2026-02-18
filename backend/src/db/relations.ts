import { relations } from "drizzle-orm";
import { survey, Question, option, poll, votes } from "./schema";

/* Survey ↔ Question */
export const surveyRelations = relations(survey, ({ many }) => ({
  questions: many(Question),
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
export const pollRelations = relations(poll, ({ many }) => ({
  votes: many(votes),
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
}));
