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
  id: int("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  expiry: numeric("expiry", { mode: "number" }),
});

export const Question = sqliteTable("question", {
  id: int("id").primaryKey(),
  question: text("question").notNull(),
  surveyId: int("survey_id")
    .notNull()
    .references(() => survey.id),
  response: text("ans"),
});


export const option = sqliteTable("option", {
  id: int("id").primaryKey(),
  data: text("data").notNull(),
  questionId: int("question_id").references(() => Question.id),
  pollId: int("poll_id").references(() => poll.id),
});


export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey(),
  userId: text("user_id").references(() => usersTable.id),
  pollId: integer("poll_id").references(() => poll.id),
  optionId: integer("option_id").references(() => option.id),
  isPublic: integer("is_public", { mode: "boolean" }),
  anonymous: integer("anonymous", { mode: "boolean" }),
});
export const poll = sqliteTable("poll", {
  id: int("id").primaryKey(),
  statement: text("statement").notNull(),
  expiry: numeric("expiry", { mode: "number" }).notNull(),
  userId:text("user_id").references(()=>usersTable.id)
});
