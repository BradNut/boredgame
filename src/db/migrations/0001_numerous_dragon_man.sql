ALTER TABLE "collection_items" ALTER COLUMN "collection_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "collection_items" ALTER COLUMN "game_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "expansions" ALTER COLUMN "base_game_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "expansions" ALTER COLUMN "game_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "wishlist_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "wishlist_items" ALTER COLUMN "game_id" SET DATA TYPE uuid;