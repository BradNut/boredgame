ALTER TABLE "artists" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "designers" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "designers" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "designers" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "designers" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "expansions" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "expansions" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "expansions" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "expansions" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "last_sync_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "mechanics" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "mechanics" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "mechanics" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "mechanics" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "publishers" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "publishers" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "publishers" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "publishers" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "updated_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "wishlists" ALTER COLUMN "created_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "wishlists" ALTER COLUMN "created_at" SET DEFAULT (now());--> statement-breakpoint
ALTER TABLE "wishlists" ALTER COLUMN "updated_at" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "wishlists" ALTER COLUMN "updated_at" SET DEFAULT (now());