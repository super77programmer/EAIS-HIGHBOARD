CREATE TABLE `auth_challenges` (
	`nonce` text PRIMARY KEY NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `auth_challenge_expiry` ON `auth_challenges` (`expires`);--> statement-breakpoint
CREATE TABLE `google_accounts` (
	`subject` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `google_account_email` ON `google_accounts` (`email`);