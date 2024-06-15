DO $$ BEGIN
 CREATE TYPE "public"."external_id_type" AS ENUM('game', 'category', 'mechanic', 'publisher', 'designer', 'artist');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
