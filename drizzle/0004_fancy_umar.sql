DO $$ BEGIN
 CREATE TYPE "external_id_type" AS ENUM('game', 'category', 'mechanic', 'publisher', 'designer', 'artist');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "external_ids" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" varchar(255),
	"external_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game_external_ids" (
	"game_id" varchar(255) NOT NULL,
	"external_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_external_id_unique";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN IF EXISTS "external_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_external_ids" ADD CONSTRAINT "game_external_ids_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_external_ids" ADD CONSTRAINT "game_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
