CREATE TABLE `answer` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`question_id` integer NOT NULL,
	`response_text` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `answer_option` (
	`answer_id` integer NOT NULL,
	`option_id` integer NOT NULL,
	FOREIGN KEY (`answer_id`) REFERENCES `answer`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON UPDATE no action ON DELETE no action
);
