CREATE TABLE IF NOT EXISTS "categories_to_external_ids" (
	"category_id" varchar(255) NOT NULL,
	"external_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expansions_to_external_ids" (
	"expansion_id" varchar(255) NOT NULL,
	"external_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics_to_external_ids" (
	"mechanic_id" varchar(255) NOT NULL,
	"external_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers_to_external_ids" (
	"publisher_id" varchar(255) NOT NULL,
	"external_id" varchar(255) NOT NULL
);
--> statement-breakpoint
DROP TABLE "artists";--> statement-breakpoint
DROP TABLE "artists_to_games";--> statement-breakpoint
DROP TABLE "designers";--> statement-breakpoint
DROP TABLE "designers_to_games";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_external_ids" ADD CONSTRAINT "categories_to_external_ids_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_external_ids" ADD CONSTRAINT "categories_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expansions_to_external_ids" ADD CONSTRAINT "expansions_to_external_ids_expansion_id_expansions_id_fk" FOREIGN KEY ("expansion_id") REFERENCES "expansions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expansions_to_external_ids" ADD CONSTRAINT "expansions_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mechanics_to_external_ids" ADD CONSTRAINT "mechanics_to_external_ids_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "mechanics"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mechanics_to_external_ids" ADD CONSTRAINT "mechanics_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publishers_to_external_ids" ADD CONSTRAINT "publishers_to_external_ids_publisher_id_publishers_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publishers_to_external_ids" ADD CONSTRAINT "publishers_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
