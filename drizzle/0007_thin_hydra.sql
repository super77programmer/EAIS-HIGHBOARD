CREATE TABLE `trip_contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`trip` text NOT NULL,
	`actor` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `trip_contact_trip` ON `trip_contacts` (`trip`);--> statement-breakpoint
CREATE TABLE `trip_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`trip` text NOT NULL,
	`contact` text NOT NULL,
	`student` text NOT NULL,
	`body` text NOT NULL,
	`answer` text DEFAULT '' NOT NULL,
	`created` integer NOT NULL,
	`answered` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `trip_question_student` ON `trip_questions` (`student`);--> statement-breakpoint
CREATE INDEX `trip_question_contact` ON `trip_questions` (`contact`);