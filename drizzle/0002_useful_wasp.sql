CREATE INDEX `comm_message_thread_created` ON `comm_messages` (`thread`,`created`);--> statement-breakpoint
CREATE INDEX `comm_message_file` ON `comm_messages` (`file`);--> statement-breakpoint
CREATE INDEX `comm_session_expiry` ON `comm_sessions` (`expires`);--> statement-breakpoint
CREATE INDEX `comm_thread_owner` ON `comm_threads` (`owner`);--> statement-breakpoint
CREATE INDEX `comm_thread_teacher` ON `comm_threads` (`teacher`);