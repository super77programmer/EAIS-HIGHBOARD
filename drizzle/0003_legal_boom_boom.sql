CREATE TABLE `comm_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`target` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`thread` text NOT NULL,
	`author` text NOT NULL,
	`body` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_recovery` (
	`token` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `comm_threads` ADD `account` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `comm_threads` ADD `category` text DEFAULT 'General' NOT NULL;--> statement-breakpoint
ALTER TABLE `comm_threads` ADD `assignee` text DEFAULT '' NOT NULL;