ALTER TABLE `question` ADD `type` text;--> statement-breakpoint
ALTER TABLE `survey` ADD `title` text;--> statement-breakpoint
ALTER TABLE `survey` ADD `description` text;--> statement-breakpoint
ALTER TABLE `survey` ADD `state` text DEFAULT 'open' NOT NULL;--> statement-breakpoint
ALTER TABLE `survey` ADD `visibility` text DEFAULT 'public' NOT NULL;