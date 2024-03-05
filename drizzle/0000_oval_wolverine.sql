CREATE TABLE IF NOT EXISTS "artists" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"external_id" integer,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "artists_to_games" (
	"artist_id" varchar(255),
	"game_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"external_id" integer,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories_to_games" (
	"category_id" varchar(255),
	"game_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"collection_id" varchar(255) NOT NULL,
	"game_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "designers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"external_id" integer,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "designers_to_games" (
	"designer_id" varchar(255),
	"game_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expansions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"base_game_id" varchar(255) NOT NULL,
	"game_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "games" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"description" text,
	"year_published" integer,
	"min_players" integer,
	"max_players" integer,
	"playtime" integer,
	"min_playtime" integer,
	"max_playtime" integer,
	"min_age" integer,
	"image_url" varchar(255),
	"thumb_url" varchar(255),
	"url" varchar(255),
	"external_id" integer,
	"last_sync_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6)),
	CONSTRAINT "games_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"external_id" integer,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mechanics_to_games" (
	"mechanic_id" varchar(255),
	"game_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"slug" varchar(255),
	"external_id" integer,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publishers_to_games" (
	"publisher_id" varchar(255),
	"game_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_country" varchar(255),
	"ip_address" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255),
	"hashed_password" varchar(255),
	"email" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"verified" boolean DEFAULT false,
	"receive_email" boolean DEFAULT false,
	"theme" varchar(255) DEFAULT 'system',
	"created_at" timestamp DEFAULT (now(6)),
	"updated_at" timestamp DEFAULT (now(6)),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"wishlist_id" varchar(255) NOT NULL,
	"game_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlists" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now(6)),
	"updated_at" timestamp with time zone DEFAULT (now(6))
);
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
 ALTER TABLE "expansions" ADD CONSTRAINT "expansions_base_game_id_games_id_fk" FOREIGN KEY ("base_game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expansions" ADD CONSTRAINT "expansions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
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
