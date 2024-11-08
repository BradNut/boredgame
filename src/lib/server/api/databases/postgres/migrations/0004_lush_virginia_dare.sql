ALTER TABLE "two_factor"
	DROP CONSTRAINT "two_factor_userId_unique";--> statement-breakpoint
ALTER TABLE "two_factor"
	ADD CONSTRAINT "two_factor_user_id_unique" UNIQUE ("user_id");