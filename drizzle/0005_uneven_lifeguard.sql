ALTER TABLE "game_external_ids" RENAME TO "games_to_external_ids";--> statement-breakpoint
ALTER TABLE "games_to_external_ids" DROP CONSTRAINT "game_external_ids_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "games_to_external_ids" DROP CONSTRAINT "game_external_ids_external_id_external_ids_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_external_ids" ADD CONSTRAINT "games_to_external_ids_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_external_ids" ADD CONSTRAINT "games_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
