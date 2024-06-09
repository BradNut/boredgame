DROP INDEX IF EXISTS "search_index";--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_index" ON "games" USING gin ((
				setweight(to_tsvector('english', "name"), 'A') ||
				setweight(to_tsvector('english', "slug"), 'B')
			));