CREATE TABLE `comm_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_files` (
	`id` text PRIMARY KEY NOT NULL,
	`thread` text NOT NULL,
	`actor` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`object_key` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`thread` text NOT NULL,
	`sender` text NOT NULL,
	`label` text NOT NULL,
	`body` text NOT NULL,
	`file` text DEFAULT '' NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_people` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`class_name` text DEFAULT '' NOT NULL,
	`classes` text DEFAULT '[]' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_reads` (
	`thread` text NOT NULL,
	`actor` text NOT NULL,
	`seen` integer NOT NULL,
	PRIMARY KEY(`thread`, `actor`)
);
--> statement-breakpoint
CREATE TABLE `comm_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`actor` text NOT NULL,
	`reason` text NOT NULL,
	`created` integer NOT NULL,
	`resolved` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comm_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`teacher` text DEFAULT '' NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'Received' NOT NULL,
	`updated` integer NOT NULL
);
