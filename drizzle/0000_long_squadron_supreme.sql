CREATE TABLE `attempts` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`until` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `responses` (
	`item` text NOT NULL,
	`student` text NOT NULL,
	`value` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`item`, `student`)
);
