import { relations } from "drizzle-orm";
import {
  usersTable,
  survey,
  question,
  questionOption,
  surveySubmission,
  answer,
  poll,
  pollOption,
  vote,
} from "./schema";

// ─── USER ──────────────────────────────────────────────────────────────────

export const userRelations = relations(usersTable, ({ many }) => ({
  surveys: many(survey),
  polls: many(poll),
  surveySubmissions: many(surveySubmission),
  votes: many(vote),
}));

// ─── SURVEY ────────────────────────────────────────────────────────────────

export const surveyRelations = relations(survey, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [survey.userId],
    references: [usersTable.id],
  }),
  questions: many(question),
  submissions: many(surveySubmission),
}));

export const questionRelations = relations(question, ({ one, many }) => ({
  survey: one(survey, {
    fields: [question.surveyId],
    references: [survey.id],
  }),
  options: many(questionOption),
  answers: many(answer),
}));

export const questionOptionRelations = relations(questionOption, ({ one }) => ({
  question: one(question, {
    fields: [questionOption.questionId],
    references: [question.id],
  }),
}));

export const surveySubmissionRelations = relations(surveySubmission, ({ one, many }) => ({
  survey: one(survey, {
    fields: [surveySubmission.surveyId],
    references: [survey.id],
  }),
  user: one(usersTable, {
    fields: [surveySubmission.userId],
    references: [usersTable.id],
  }),
  answers: many(answer),
}));

export const answerRelations = relations(answer, ({ one }) => ({
  submission: one(surveySubmission, {
    fields: [answer.submissionId],
    references: [surveySubmission.id],
  }),
  question: one(question, {
    fields: [answer.questionId],
    references: [question.id],
  }),
}));

// ─── POLL ──────────────────────────────────────────────────────────────────

export const pollRelations = relations(poll, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [poll.userId],
    references: [usersTable.id],
  }),
  options: many(pollOption),
  votes: many(vote),
}));

export const pollOptionRelations = relations(pollOption, ({ one, many }) => ({
  poll: one(poll, {
    fields: [pollOption.pollId],
    references: [poll.id],
  }),
  votes: many(vote),
}));

export const voteRelations = relations(vote, ({ one }) => ({
  poll: one(poll, {
    fields: [vote.pollId],
    references: [poll.id],
  }),
  pollOption: one(pollOption, {
    fields: [vote.pollOptionId],
    references: [pollOption.id],
  }),
  user: one(usersTable, {
    fields: [vote.userId],
    references: [usersTable.id],
  }),
}));
