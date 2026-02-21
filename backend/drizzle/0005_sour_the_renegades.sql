PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_question` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`survey_id` integer NOT NULL,
	`ans` text,
	`type` text,
	FOREIGN KEY (`survey_id`) REFERENCES `survey`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_question`("id", "question", "survey_id", "ans", "type") SELECT "id", "question", "survey_id", "ans", "type" FROM `question`;--> statement-breakpoint
DROP TABLE `question`;--> statement-breakpoint
ALTER TABLE `__new_question` RENAME TO `question`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_answer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`question_id` integer NOT NULL,
	`response_text` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_answer`("id", "user_id", "question_id", "response_text") SELECT "id", "user_id", "question_id", "response_text" FROM `answer`;--> statement-breakpoint
DROP TABLE `answer`;--> statement-breakpoint
ALTER TABLE `__new_answer` RENAME TO `answer`;--> statement-breakpoint
CREATE TABLE `__new_option` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data` text NOT NULL,
	`question_id` integer,
	`poll_id` integer,
	FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poll_id`) REFERENCES `poll`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_option`("id", "data", "question_id", "poll_id") SELECT "id", "data", "question_id", "poll_id" FROM `option`;--> statement-breakpoint
DROP TABLE `option`;--> statement-breakpoint
ALTER TABLE `__new_option` RENAME TO `option`;--> statement-breakpoint
CREATE TABLE `__new_poll` (
	`id` text PRIMARY KEY NOT NULL,
	`statement` text NOT NULL,
	`expiry` numeric NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_poll`("id", "statement", "expiry", "user_id") SELECT "id", "statement", "expiry", "user_id" FROM `poll`;--> statement-breakpoint
DROP TABLE `poll`;--> statement-breakpoint
ALTER TABLE `__new_poll` RENAME TO `poll`;--> statement-breakpoint
CREATE TABLE `__new_survey` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`expiry` numeric,
	`title` text,
	`description` text,
	`state` text DEFAULT 'open' NOT NULL,
	`visibility` text DEFAULT 'public' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_survey`("id", "user_id", "expiry", "title", "description", "state", "visibility") SELECT "id", "user_id", "expiry", "title", "description", "state", "visibility" FROM `survey`;--> statement-breakpoint
DROP TABLE `survey`;--> statement-breakpoint
ALTER TABLE `__new_survey` RENAME TO `survey`;--> statement-breakpoint
CREATE TABLE `__new_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`poll_id` integer,
	`option_id` integer,
	`is_public` integer,
	`anonymous` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poll_id`) REFERENCES `poll`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_votes`("id", "user_id", "poll_id", "option_id", "is_public", "anonymous") SELECT "id", "user_id", "poll_id", "option_id", "is_public", "anonymous" FROM `votes`;--> statement-breakpoint
DROP TABLE `votes`;--> statement-breakpoint
ALTER TABLE `__new_votes` RENAME TO `votes`;