DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('game', 'category', 'mechanic', 'publisher', 'designer', 'artist');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "external_ids" ALTER COLUMN "type" SET DATA TYPE type;