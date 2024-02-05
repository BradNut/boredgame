CREATE TABLE `artists_to_games` (
	`artist_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `categories_to_games` (
	`category_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `designers_to_games` (
	`designer_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `mechanics_to_games` (
	`mechanic_id` varchar(255),
	`game_id` varchar(255)
);
--> statement-breakpoint
CREATE TABLE `publishers_to_games` (
	`publisher_id` varchar(255),
	`game_id` varchar(255)
);
