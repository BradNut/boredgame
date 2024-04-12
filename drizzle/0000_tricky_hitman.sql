DO $$ BEGIN
 CREATE TYPE "external_id_type" AS ENUM('game', 'category', 'mechanic', 'publisher', 'designer', 'artist');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"name" text,
	"slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_to_external_ids" (
	"category_id" uuid NOT NULL,
	"external_id" uuid NOT NULL,
	CONSTRAINT "categories_to_external_ids_category_id_external_id_pk" PRIMARY KEY("category_id","external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_to_games" (
	"category_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	CONSTRAINT "categories_to_games_category_id_game_id_pk" PRIMARY KEY("category_id","game_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"collection_id" text NOT NULL,
	"game_id" text NOT NULL,
	"times_played" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collection_items_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collections_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expansions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"base_game_id" text NOT NULL,
	"game_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "expansions_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "external_ids" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"type" "external_id_type" NOT NULL,
	"external_id" text NOT NULL,
	CONSTRAINT "external_ids_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"name" text,
	"slug" text,
	"description" text,
	"year_published" integer,
	"min_players" integer,
	"max_players" integer,
	"playtime" integer,
	"min_playtime" integer,
	"max_playtime" integer,
	"min_age" integer,
	"image_url" text,
	"thumb_url" text,
	"url" text,
	"text_searchable_index" "tsvector",
	"last_sync_at" timestamp (6) with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "games_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games_to_external_ids" (
	"game_id" uuid NOT NULL,
	"external_id" uuid NOT NULL,
	CONSTRAINT "games_to_external_ids_game_id_external_id_pk" PRIMARY KEY("game_id","external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"name" text,
	"slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mechanics_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics_to_external_ids" (
	"mechanic_id" uuid NOT NULL,
	"external_id" uuid NOT NULL,
	CONSTRAINT "mechanics_to_external_ids_mechanic_id_external_id_pk" PRIMARY KEY("mechanic_id","external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics_to_games" (
	"mechanic_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	CONSTRAINT "mechanics_to_games_mechanic_id_game_id_pk" PRIMARY KEY("mechanic_id","game_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp (6) with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"name" text,
	"slug" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "publishers_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers_to_external_ids" (
	"publisher_id" uuid NOT NULL,
	"external_id" uuid NOT NULL,
	CONSTRAINT "publishers_to_external_ids_publisher_id_external_id_pk" PRIMARY KEY("publisher_id","external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers_to_games" (
	"publisher_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	CONSTRAINT "publishers_to_games_publisher_id_game_id_pk" PRIMARY KEY("publisher_id","game_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"name" text,
	CONSTRAINT "roles_cuid_unique" UNIQUE("cuid"),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_country" text,
	"ip_address" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"username" text,
	"hashed_password" text,
	"email" text,
	"first_name" text,
	"last_name" text,
	"verified" boolean DEFAULT false,
	"receive_email" boolean DEFAULT false,
	"theme" text DEFAULT 'system',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_cuid_unique" UNIQUE("cuid"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"wishlist_id" text NOT NULL,
	"game_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_items_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cuid" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wishlists_cuid_unique" UNIQUE("cuid")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "text_searchable_idx" ON "games" ("text_searchable_index");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_external_ids" ADD CONSTRAINT "categories_to_external_ids_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories_to_external_ids" ADD CONSTRAINT "categories_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE restrict ON UPDATE cascade;
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
 ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "expansions" ADD CONSTRAINT "expansions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE restrict ON UPDATE cascade;
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
 ALTER TABLE "games_to_external_ids" ADD CONSTRAINT "games_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE restrict ON UPDATE cascade;
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
 ALTER TABLE "mechanics_to_external_ids" ADD CONSTRAINT "mechanics_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE restrict ON UPDATE cascade;
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
 ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "publishers_to_external_ids" ADD CONSTRAINT "publishers_to_external_ids_external_id_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "external_ids"("id") ON DELETE restrict ON UPDATE cascade;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_wishlist_id_wishlists_id_fk" FOREIGN KEY ("wishlist_id") REFERENCES "wishlists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
