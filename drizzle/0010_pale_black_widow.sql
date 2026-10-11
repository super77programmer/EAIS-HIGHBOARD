CREATE TABLE `personal_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`title` text NOT NULL,
	`subject` text DEFAULT '' NOT NULL,
	`due` text DEFAULT '' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`done` integer DEFAULT 0 NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `personal_task_actor` ON `personal_tasks` (`actor`);--> statement-breakpoint
CREATE TABLE `school_preferences` (
	`actor` text PRIMARY KEY NOT NULL,
	`home_focus` text DEFAULT 'balanced' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trip_collection` (
	`trip` text NOT NULL,
	`student` text NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`permission` integer DEFAULT 0 NOT NULL,
	`collector` text NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`trip`, `student`)
);
