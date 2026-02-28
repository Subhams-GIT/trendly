import { randomUUID } from "node:crypto";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";


export const usersTable = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});


export const survey = sqliteTable("survey", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  expiry: integer("expiry", { mode: "timestamp" }),
  title: text("title"),
  description: text("description"),
  state: text("state", { enum: ["open", "closed"] }).notNull().default("open"),
  visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("public"),
  link: text("survey_link").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const question = sqliteTable("question", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  surveyId: text("survey_id").notNull().references(() => survey.id),
  question: text("question").notNull(),
  type: text("type", { enum: ["single", "multi", "text"] }).notNull().default("text"),
  required: integer("required", { mode: "boolean" }).notNull().default(sql`TRUE`)
});


export const questionOption = sqliteTable("question_option", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  questionId: text("question_id").notNull().references(() => question.id),
  data: text("data", { mode: "json" }).notNull(),
});


export const surveySubmission = sqliteTable("survey_submission", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  surveyId: text("survey_id").notNull().references(() => survey.id),
  userId: text("user_id").notNull().references(() => usersTable.id),
  submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
}, (t) => [unique().on(t.surveyId, t.userId)]);

export const answer = sqliteTable("answer", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  submissionId: text("submission_id").notNull().references(() => surveySubmission.id),
  questionId: text("question_id").notNull().references(() => question.id),
  response: text("response", { mode: "json" }).notNull(),
});


export const poll = sqliteTable("poll", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  statement: text("statement").notNull(),
  expiry: integer("expiry", { mode: "timestamp" }).notNull(),
  state: text("state", { enum: ["open", "closed", "archived"] }).notNull().default("open"),
  visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("public"),
  link: text("poll_link").unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});


export const pollOption = sqliteTable("poll_option", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  pollId: text("poll_id").notNull().references(() => poll.id),
  data: text("data").notNull(),
  voteCount: integer("vote_count").notNull().default(0),
});

export const vote = sqliteTable("vote", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  pollId: text("poll_id").notNull().references(() => poll.id),
  pollOptionId: text("poll_option_id").notNull().references(() => pollOption.id),
  userId: text("user_id").notNull(),
  voteMode: text("vote_mode", { enum: ["anonymous", "authenticated"] }).notNull().default("authenticated"),
}, (t) => [unique().on(t.pollId, t.userId)]);


export const private_users_poll = sqliteTable(
  "private_users_poll", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  pollId: text("poll_id").notNull().references(() => poll.id),
  userId: text("user_id").notNull().references(() => usersTable.id),
  token: text("token"),
}, (t) => [unique().on(t.pollId, t.userId)]);


export const private_users_survey = sqliteTable(
  "private_users_survey",
  {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),

    surveyId: text("survey_id")
      .notNull()
      .references(() => survey.id),

    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
    token: text("token"),
  },
  (t) => [
    unique().on(t.surveyId, t.userId),
  ]
);
