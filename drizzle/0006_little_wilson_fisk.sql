CREATE TABLE `trip_interest` (
	`trip` text NOT NULL,
	`actor` text NOT NULL,
	`choice` text NOT NULL,
	`created` integer NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`trip`, `actor`)
);
--> statement-breakpoint
CREATE INDEX `trip_interest_actor` ON `trip_interest` (`actor`);