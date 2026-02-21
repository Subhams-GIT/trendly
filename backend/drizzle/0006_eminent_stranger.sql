PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_question` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`survey_id` text NOT NULL,
	`ans` text,
	`type` text,
	FOREIGN KEY (`survey_id`) REFERENCES `survey`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_question`("id", "question", "survey_id", "ans", "type") SELECT "id", "question", "survey_id", "ans", "type" FROM `question`;--> statement-breakpoint
DROP TABLE `question`;--> statement-breakpoint
ALTER TABLE `__new_question` RENAME TO `question`;--> statement-breakpoint
PRAGMA foreign_keys=ON;