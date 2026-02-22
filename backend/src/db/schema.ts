import { randomUUID } from "node:crypto";
import { int, integer,sqliteTable, text } from "drizzle-orm/sqlite-core";


export const usersTable = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});


export const survey = sqliteTable("survey", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").references(() => usersTable.id).notNull(),
  expiry: integer("expiry", { mode: "timestamp" }),
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
});


export const option = sqliteTable("option", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  data: text("data").notNull(),
  questionId: int("question_id").references(() => Question.id).notNull(),
  vote_count:integer("vote_count").default(0)
});


export const poll = sqliteTable("poll", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),

  statement: text("statement").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),

  expiry: integer("expiry", { mode: "timestamp" }).notNull(),

  state: text("state", {
    enum: ["open", "closed", "archived"],
  }).notNull().default("open"),

  visibility: text("visibility", {
    enum: ["public", "private"], // private -> visible to a set of users only based on regex pattern
  }).notNull().default("public"),

  voteMode: text("vote_mode", {
    enum: ["anonymous", "authenticated"],
  }).notNull().default("authenticated"),
});


export const votes = sqliteTable("votes", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  userId: text("user_id").references(() => usersTable.id),
  pollId: integer("poll_id").references(() => poll.id),
  optionId: integer("option_id").references(() => option.id),
});

/*
votes -> public -> authenticated , anonymous
      -> private -> authenticated votes,
 */


export const answer = sqliteTable("answer", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),

  questionId: int("question_id")
    .notNull()
    .references(() => Question.id),

  response: text("response", { mode: "json" }).notNull()
});
