CREATE TABLE `teacher_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`author` text NOT NULL,
	`class_name` text NOT NULL,
	`student` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`report_date` text NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`review` text DEFAULT '' NOT NULL,
	`reviewer` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `teacher_report_author` ON `teacher_reports` (`author`,`updated`);--> statement-breakpoint
CREATE INDEX `teacher_report_status` ON `teacher_reports` (`status`,`updated`);