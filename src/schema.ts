import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import {
	pgTable,
	timestamp,
	text,
	boolean,
	integer,
	index,
	pgEnum,
	primaryKey,
	uuid
} from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import { tsvector } from './tsVector';

// User Related Schemas

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	username: text('username').unique(),
	hashed_password: text('hashed_password'),
	email: text('email').unique(),
	first_name: text('first_name'),
	last_name: text('last_name'),
	verified: boolean('verified').default(false),
	receive_email: boolean('receive_email').default(false),
	theme: text('theme').default('system'),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const user_relations = relations(users, ({ many }) => ({
	user_roles: many(user_roles)
}));

export type Users = InferSelectModel<typeof users>;

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	ipCountry: text('ip_country'),
	ipAddress: text('ip_address')
});

export const roles = pgTable('roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2())
		.notNull(),
	name: text('name').unique().notNull()
});

export type Roles = InferSelectModel<typeof roles>;

export const role_relations = relations(roles, ({ many }) => ({
	user_roles: many(user_roles)
}));

export const user_roles = pgTable('user_roles', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role_id: uuid('role_id')
		.notNull()
		.references(() => roles.id, { onDelete: 'cascade' }),
	primary: boolean('primary').default(false),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const user_role_relations = relations(user_roles, ({ one }) => ({
	role: one(roles, {
		fields: [user_roles.role_id],
		references: [roles.id]
	}),
	user: one(users, {
		fields: [user_roles.user_id],
		references: [users.id]
	})
}));

export type UserRoles = InferSelectModel<typeof user_roles>;

export const password_reset_tokens = pgTable('password_reset_tokens', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires_at: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}),
	created_at: timestamp('created_at').notNull().defaultNow()
});

export const password_reset_token_relations = relations(password_reset_tokens, ({ one }) => ({
	user: one(users, {
		fields: [password_reset_tokens.user_id],
		references: [users.id]
	})
}));

export const collections = pgTable('collections', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const collection_relations = relations(collections, ({ one }) => ({
	user: one(users, {
		fields: [collections.user_id],
		references: [users.id]
	})
}));

export const collection_items = pgTable('collection_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	collection_id: uuid('collection_id')
		.notNull()
		.references(() => collections.id, { onDelete: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	times_played: integer('times_played').default(0),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type CollectionItems = InferSelectModel<typeof collection_items>;

export const collection_item_relations = relations(collection_items, ({ one }) => ({
	collection: one(collections, {
		fields: [collection_items.collection_id],
		references: [collections.id]
	}),
	game: one(games, {
		fields: [collection_items.game_id],
		references: [games.id]
	})
}));

export const wishlists = pgTable('wishlists', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	user_id: uuid('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type Wishlists = InferSelectModel<typeof wishlists>;

export const wishlists_relations = relations(wishlists, ({ one }) => ({
	user: one(users, {
		fields: [wishlists.user_id],
		references: [users.id]
	})
}));

export const wishlist_items = pgTable('wishlist_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	wishlist_id: uuid('wishlist_id')
		.notNull()
		.references(() => wishlists.id, { onDelete: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type WishlistItems = InferSelectModel<typeof wishlist_items>;

export const wishlist_item_relations = relations(wishlist_items, ({ one }) => ({
	wishlist: one(wishlists, {
		fields: [wishlist_items.wishlist_id],
		references: [wishlists.id]
	}),
	game: one(games, {
		fields: [wishlist_items.game_id],
		references: [games.id]
	})
}));

// Game and related table schemas

export const externalIdType = pgEnum('external_id_type', [
	'game',
	'category',
	'mechanic',
	'publisher',
	'designer',
	'artist'
]);

export const externalIds = pgTable('external_ids', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	type: externalIdType('type').notNull(),
	externalId: text('external_id').notNull()
});

export type ExternalIds = InferSelectModel<typeof externalIds>;

export const games = pgTable(
	'games',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		cuid: text('cuid')
			.unique()
			.$defaultFn(() => cuid2()),
		name: text('name'),
		slug: text('slug'),
		description: text('description'),
		year_published: integer('year_published'),
		min_players: integer('min_players'),
		max_players: integer('max_players'),
		playtime: integer('playtime'),
		min_playtime: integer('min_playtime'),
		max_playtime: integer('max_playtime'),
		min_age: integer('min_age'),
		image_url: text('image_url'),
		thumb_url: text('thumb_url'),
		url: text('url'),
		text_searchable_index: tsvector('text_searchable_index'),
		last_sync_at: timestamp('last_sync_at', {
			withTimezone: true,
			mode: 'date',
			precision: 6
		}),
		created_at: timestamp('created_at').notNull().defaultNow(),
		updated_at: timestamp('updated_at').notNull().defaultNow()
	},
	(table) => {
		return {
			text_searchable_idx: index('text_searchable_idx')
				.on(table.text_searchable_index)
				.using(sql`'gin'`)
		};
	}
);

export type Games = InferSelectModel<typeof games>;

export const gamesToExternalIds = pgTable(
	'games_to_external_ids',
	{
		gameId: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			gamesToExternalIdsPkey: primaryKey({
				columns: [table.gameId, table.externalId]
			})
		};
	}
);

export const gameRelations = relations(games, ({ many }) => ({
	categories_to_games: many(categories_to_games),
	mechanics_to_games: many(mechanics_to_games),
	publishers_to_games: many(publishers_to_games),
	gamesToExternalIds: many(gamesToExternalIds)
}));

export const expansions = pgTable('expansions', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	base_game_id: uuid('base_game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: uuid('game_id')
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type Expansions = InferSelectModel<typeof expansions>;

export const expansion_relations = relations(expansions, ({ one }) => ({
	baseGame: one(games, {
		fields: [expansions.base_game_id],
		references: [games.id]
	}),
	game: one(games, {
		fields: [expansions.game_id],
		references: [games.id]
	})
}));

export const publishers = pgTable('publishers', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type Publishers = InferSelectModel<typeof publishers>;

export const publishersToExternalIds = pgTable(
	'publishers_to_external_ids',
	{
		publisherId: uuid('publisher_id')
			.notNull()
			.references(() => publishers.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			publishersToExternalIdsPkey: primaryKey({
				columns: [table.publisherId, table.externalId]
			})
		};
	}
);

export const publishers_relations = relations(publishers, ({ many }) => ({
	publishers_to_games: many(publishers_to_games),
	publishersToExternalIds: many(publishersToExternalIds)
}));

export const categories = pgTable('categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type Categories = InferSelectModel<typeof categories>;

export const categoriesToExternalIds = pgTable(
	'categories_to_external_ids',
	{
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			categoriesToExternalIdsPkey: primaryKey({
				columns: [table.categoryId, table.externalId]
			})
		};
	}
);

export const categories_to_games = pgTable(
	'categories_to_games',
	{
		category_id: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			categoriesToGamesPkey: primaryKey({
				columns: [table.category_id, table.game_id]
			})
		};
	}
);

export const categories_to_games_relations = relations(categories_to_games, ({ one }) => ({
	category: one(categories, {
		fields: [categories_to_games.category_id],
		references: [categories.id]
	}),
	game: one(games, {
		fields: [categories_to_games.game_id],
		references: [games.id]
	})
}));

export const categories_relations = relations(categories, ({ many }) => ({
	categories_to_games: many(categories_to_games),
	categoriesToExternalIds: many(categoriesToExternalIds)
}));

export const mechanics = pgTable('mechanics', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	name: text('name'),
	slug: text('slug'),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow()
});

export type Mechanics = InferSelectModel<typeof mechanics>;

export const mechanicsToExternalIds = pgTable(
	'mechanics_to_external_ids',
	{
		mechanicId: uuid('mechanic_id')
			.notNull()
			.references(() => mechanics.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			mechanicsToExternalIdsPkey: primaryKey({
				columns: [table.mechanicId, table.externalId]
			})
		};
	}
);

export const mechanic_relations = relations(mechanics, ({ many }) => ({
	mechanics_to_games: many(mechanics_to_games),
	mechanicsToExternalIds: many(mechanicsToExternalIds)
}));

export const mechanics_to_games = pgTable(
	'mechanics_to_games',
	{
		mechanic_id: uuid('mechanic_id')
			.notNull()
			.references(() => mechanics.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			mechanicsToGamesPkey: primaryKey({
				columns: [table.mechanic_id, table.game_id]
			})
		};
	}
);

export const mechanics_to_games_relations = relations(mechanics_to_games, ({ one }) => ({
	mechanic: one(mechanics, {
		fields: [mechanics_to_games.mechanic_id],
		references: [mechanics.id]
	}),
	game: one(games, {
		fields: [mechanics_to_games.game_id],
		references: [games.id]
	})
}));

export const publishers_to_games = pgTable(
	'publishers_to_games',
	{
		publisher_id: uuid('publisher_id')
			.notNull()
			.references(() => publishers.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		game_id: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			publishersToGamesPkey: primaryKey({
				columns: [table.publisher_id, table.game_id]
			})
		};
	}
);

export const publishers_to_games_relations = relations(publishers_to_games, ({ one }) => ({
	publisher: one(publishers, {
		fields: [publishers_to_games.publisher_id],
		references: [publishers.id]
	}),
	game: one(games, {
		fields: [publishers_to_games.game_id],
		references: [games.id]
	})
}));
