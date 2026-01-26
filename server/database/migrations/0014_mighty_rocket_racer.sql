CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`icon` text,
	`parent_id` text,
	`order` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `component_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`component_id` text,
	`views` integer,
	`likes` integer,
	`downloads` integer,
	`forks` integer,
	`last_viewed_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`component_id`) REFERENCES `marketplace_components`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `component_stats_component_id_unique` ON `component_stats` (`component_id`);--> statement-breakpoint
CREATE TABLE `component_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`component_id` text,
	`tag_id` text,
	`created_at` integer,
	FOREIGN KEY (`component_id`) REFERENCES `marketplace_components`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customizations` (
	`id` text PRIMARY KEY NOT NULL,
	`base_component_id` text,
	`user_id` integer,
	`customization_type` text NOT NULL,
	`design_tokens` text,
	`ai_prompt` text,
	`result_component_id` text,
	`status` text NOT NULL,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`base_component_id`) REFERENCES `marketplace_components`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `marketplace_components` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`component_id` text,
	`author_id` integer,
	`status` text NOT NULL,
	`is_featured` integer,
	`category` text NOT NULL,
	`license` text,
	`version` text,
	`preview_url` text,
	`repository_url` text,
	`published_at` integer,
	`created_at` integer,
	`updated_at` integer,
	`metadata` text,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`component_id` text,
	`user_id` integer,
	`status` text NOT NULL,
	`reviewer_id` integer,
	`review_notes` text,
	`submitted_at` integer,
	`reviewed_at` integer,
	FOREIGN KEY (`component_id`) REFERENCES `marketplace_components`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`color` text,
	`count` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `user_likes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`component_id` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`component_id`) REFERENCES `marketplace_components`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `components` ADD `visibility` text;--> statement-breakpoint
ALTER TABLE `components` ADD `marketplace_id` text;--> statement-breakpoint
ALTER TABLE `components` ADD `design_tokens` text;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `website` text;--> statement-breakpoint
ALTER TABLE `users` ADD `twitter` text;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `components_published` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `total_likes` integer;