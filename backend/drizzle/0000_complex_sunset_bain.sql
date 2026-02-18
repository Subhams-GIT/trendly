CREATE TABLE `Question` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`surveyId` integer NOT NULL,
	`ans` text,
	FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`surveyId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `option` (
	`id` integer PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`question_id` integer,
	`poll_id` integer,
	FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poll_id`) REFERENCES `Poll`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Poll` (
	`id` integer PRIMARY KEY NOT NULL,
	`statement` text NOT NULL,
	`expiry` numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Survey` (
	`surveyId` integer PRIMARY KEY NOT NULL,
	`user_id` text,
	`expiry` numeric,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`refreshToken` text,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text,
	`poll_id` integer,
	`option_id` integer,
	`is_public` integer,
	`anonymous` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poll_id`) REFERENCES `Poll`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON UPDATE no action ON DELETE no action
);
