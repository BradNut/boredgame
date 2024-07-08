CREATE TABLE IF NOT EXISTS "two_factor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cuid" text,
	"two_factor_secret" text NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	"initiated_time" timestamp with time zone NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "two_factor_cuid_unique" UNIQUE("cuid"),
	CONSTRAINT "two_factor_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "two_factor_secret";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "two_factor_enabled";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "initiated_time";