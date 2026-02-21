import { randomUUID } from "node:crypto";
import { int, integer, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const usersTable = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  token: text("refreshToken"),
  password: text("password").notNull(),
});


export const survey = sqliteTable("survey", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").references(() => usersTable.id),
  expiry: numeric("expiry", { mode: "number" }),
  title: text("title"),
  description: text("description"),
  state: text("state", {
    enum: ["open", "closed", "archieved"]
  }).notNull().default("open"),
  visibility: text("visibility", {
    enum: ["public", "private"]
  }).notNull().default("public")
});

export const Question = sqliteTable("question", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  surveyId: text("survey_id")
    .notNull()
    .references(() => survey.id),
  response: text("ans"),
  type: text("type", {
    enum: ["multi-option", "text", "images", "files", "single-option"]
  })
});


export const option = sqliteTable("option", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  data: text("data").notNull(),
  questionId: int("question_id").references(() => Question.id),
  pollId: int("poll_id").references(() => poll.id),
});


export const votes = sqliteTable("votes", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").references(() => usersTable.id),
  pollId: integer("poll_id").references(() => poll.id),
  optionId: integer("option_id").references(() => option.id),
  isPublic: integer("is_public", { mode: "boolean" }),
  anonymous: integer("anonymous", { mode: "boolean" }),
});


export const poll = sqliteTable("poll", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  statement: text("statement").notNull(),
  expiry: numeric("expiry", { mode: "number" }).notNull(),
  userId: text("user_id").references(() => usersTable.id)
});

export const answer = sqliteTable("answer", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),

  questionId: int("question_id")
    .notNull()
    .references(() => Question.id),

  responseText: text("response_text"),
});

export const answerOption = sqliteTable("answer_option", {
  answerId: int("answer_id")
    .notNull()
    .references(() => answer.id),

  optionId: int("option_id")
    .notNull()
    .references(() => option.id),
});
