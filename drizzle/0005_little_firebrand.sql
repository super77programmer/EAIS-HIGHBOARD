CREATE TABLE `media_parts` (
	`upload` text NOT NULL,
	`part` integer NOT NULL,
	`etag` text NOT NULL,
	PRIMARY KEY(`upload`, `part`)
);
--> statement-breakpoint
CREATE TABLE `media_uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`thread` text NOT NULL,
	`object_key` text NOT NULL,
	`upload_id` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workspace_schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`data` text NOT NULL
);
