ALTER TABLE "users" ALTER COLUMN "two_factor_secret" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_enabled" boolean DEFAULT false;