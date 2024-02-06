CREATE TABLE `artists` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`external_id` int,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `artists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artists_to_games` (
	`artist_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`external_id` int,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories_to_games` (
	`category_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `collection_items` (
	`id` varchar(255) NOT NULL,
	`collection_id` varchar(255) NOT NULL,
	`game_id` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `collection_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `designers` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`external_id` int,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `designers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `designers_to_games` (
	`designer_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `expansions` (
	`id` varchar(255) NOT NULL,
	`base_game_id` varchar(255) NOT NULL,
	`game_id` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `expansions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`description` text,
	`year_published` year,
	`min_players` int,
	`max_players` int,
	`playtime` int,
	`min_playtime` int,
	`max_playtime` int,
	`min_age` int,
	`image_url` varchar(255),
	`thumb_url` varchar(255),
	`url` varchar(255),
	`external_id` int,
	`last_sync_at` datetime,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `games_id` PRIMARY KEY(`id`),
	CONSTRAINT `games_external_id_unique` UNIQUE(`external_id`)
);
--> statement-breakpoint
CREATE TABLE `mechanics` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`external_id` int,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `mechanics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mechanics_to_games` (
	`mechanic_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `publishers` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`slug` varchar(255),
	`external_id` int,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `publishers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publishers_to_games` (
	`publisher_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`role_id` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`username` varchar(255),
	`hashed_password` varchar(255),
	`email` varchar(255),
	`first_name` varchar(255),
	`last_name` varchar(255),
	`verified` boolean DEFAULT false,
	`receive_email` boolean DEFAULT false,
	`theme` varchar(255) DEFAULT 'system',
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `wishlist_items` (
	`id` varchar(255) NOT NULL,
	`wishlist_id` varchar(255) NOT NULL,
	`game_id` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `wishlist_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` datetime DEFAULT (now(6)),
	`updated_at` datetime DEFAULT (now(6)),
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `collection_items` ADD CONSTRAINT `collection_items_collection_id_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_items` ADD CONSTRAINT `collection_items_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collections` ADD CONSTRAINT `collections_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expansions` ADD CONSTRAINT `expansions_base_game_id_games_id_fk` FOREIGN KEY (`base_game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expansions` ADD CONSTRAINT `expansions_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_wishlist_id_wishlists_id_fk` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlist_items` ADD CONSTRAINT `wishlist_items_game_id_games_id_fk` FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;