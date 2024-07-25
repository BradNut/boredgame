ALTER TABLE "two_factor" RENAME COLUMN "two_factor_secret" TO "secret";--> statement-breakpoint
ALTER TABLE "two_factor" RENAME COLUMN "two_factor_enabled" TO "enabled";