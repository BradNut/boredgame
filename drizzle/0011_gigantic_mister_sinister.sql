ALTER TABLE "categories_to_external_ids" DROP CONSTRAINT "categories_to_external_ids_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "expansions" DROP CONSTRAINT "expansions_base_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "expansions_to_external_ids" DROP CONSTRAINT "expansions_to_external_ids_expansion_id_expansions_id_fk";
--> statement-breakpoint
ALTER TABLE "games_to_external_ids" DROP CONSTRAINT "games_to_external_ids_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "mechanics_to_external_ids" DROP CONSTRAINT "mechanics_to_external_ids_mechanic_id_mechanics_id_fk";
--> statement-breakpoint
ALTER TABLE "publishers_to_external_ids" DROP CONSTRAINT "publishers_to_external_ids_publisher_id_publishers_id_fk";
--> statement-breakpoint
ALTER TABLE "categories_to_games" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_to_games" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanics_to_games" ALTER COLUMN "mechanic_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mechanics_to_games" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "publishers_to_games" ALTER COLUMN "publisher_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "publishers_to_games" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories_to_external_ids" ADD CONSTRAINT "categories_to_external_ids_category_id_external_id_pk" PRIMARY KEY("category_id","external_id");--> statement-breakpoint
ALTER TABLE "categories_to_games" ADD CONSTRAINT "categories_to_games_category_id_game_id_pk" PRIMARY KEY("category_id","game_id");--> statement-breakpoint
ALTER TABLE "expansions_to_external_ids" ADD CONSTRAINT "expansions_to_external_ids_expansion_id_external_id_pk" PRIMARY KEY("expansion_id","external_id");--> statement-breakpoint
ALTER TABLE "games_to_external_ids" ADD CONSTRAINT "games_to_external_ids_game_id_external_id_pk" PRIMARY KEY("game_id","external_id");--> statement-breakpoint
ALTER TABLE "mechanics_to_external_ids" ADD CONSTRAINT "mechanics_to_external_ids_mechanic_id_external_id_pk" PRIMARY KEY("mechanic_id","external_id");--> statement-breakpoint
ALTER TABLE "mechanics_to_games" ADD CONSTRAINT "mechanics_to_games_mechanic_id_game_id_pk" PRIMARY KEY("mechanic_id","game_id");--> statement-breakpoint
ALTER TABLE "publishers_to_external_ids" ADD CONSTRAINT "publishers_to_external_ids_publisher_id_external_id_pk" PRIMARY KEY("publisher_id","external_id");--> statement-breakpoint
ALTER TABLE "publishers_to_games" ADD CONSTRAINT "publishers_to_games_publisher_id_game_id_pk" PRIMARY KEY("publisher_id","game_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_external_ids" ADD CONSTRAINT "categories_to_external_ids_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_games" ADD CONSTRAINT "categories_to_games_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_games" ADD CONSTRAINT "categories_to_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expansions" ADD CONSTRAINT "expansions_base_game_id_games_id_fk" FOREIGN KEY ("base_game_id") REFERENCES "games"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expansions_to_external_ids" ADD CONSTRAINT "expansions_to_external_ids_expansion_id_expansions_id_fk" FOREIGN KEY ("expansion_id") REFERENCES "expansions"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_external_ids" ADD CONSTRAINT "games_to_external_ids_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mechanics_to_external_ids" ADD CONSTRAINT "mechanics_to_external_ids_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "mechanics"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mechanics_to_games" ADD CONSTRAINT "mechanics_to_games_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "mechanics"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mechanics_to_games" ADD CONSTRAINT "mechanics_to_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publishers_to_external_ids" ADD CONSTRAINT "publishers_to_external_ids_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publishers_to_games" ADD CONSTRAINT "publishers_to_games_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publishers_to_games" ADD CONSTRAINT "publishers_to_games_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
