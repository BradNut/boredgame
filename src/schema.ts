import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import {
	pgTable,
	timestamp,
	varchar,
	boolean,
	integer,
	text,
	index,
	pgEnum,
	primaryKey
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { tsvector } from './tsVector';

// User Related Schemas

export const users = pgTable('users', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	username: varchar('username', {
		length: 255
	}).unique(),
	hashed_password: varchar('hashed_password', {
		length: 255
	}),
	email: varchar('email', {
		length: 255
	}).unique(),
	first_name: varchar('first_name', {
		length: 255
	}),
	last_name: varchar('last_name', {
		length: 255
	}),
	verified: boolean('verified').default(false),
	receive_email: boolean('receive_email').default(false),
	theme: varchar('theme', {
		length: 255
	}).default('system'),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export const user_relations = relations(users, ({ many }) => ({
	user_roles: many(user_roles)
}));

export type Users = InferSelectModel<typeof users>;

export const sessions = pgTable('sessions', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 255
	})
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	ipCountry: varchar('ip_country', {
		length: 255
	}),
	ipAddress: varchar('ip_address', {
		length: 255
	})
});

export const roles = pgTable('roles', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name', {
		length: 255
	}).unique()
});

export type Roles = InferSelectModel<typeof roles>;

export const role_relations = relations(roles, ({ many }) => ({
	user_roles: many(user_roles)
}));

export const user_roles = pgTable('user_roles', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	user_id: varchar('user_id', {
		length: 255
	})
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	role_id: varchar('role_id', {
		length: 255
	})
		.notNull()
		.references(() => roles.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
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
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	user_id: varchar('user_id', {
		length: 255
	})
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires_at: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export const collections = pgTable('collections', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	user_id: varchar('user_id', {
		length: 255
	})
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export const collection_relations = relations(collections, ({ one }) => ({
	user: one(users, {
		fields: [collections.user_id],
		references: [users.id]
	})
}));

export const collection_items = pgTable('collection_items', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	collection_id: varchar('collection_id', {
		length: 255
	})
		.notNull()
		.references(() => collections.id, { onDelete: 'cascade' }),
	game_id: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	times_played: integer('times_played').default(0),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
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
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	user_id: varchar('user_id', {
		length: 255
	})
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export type Wishlists = InferSelectModel<typeof wishlists>;

export const wishlists_relations = relations(wishlists, ({ one }) => ({
	user: one(users, {
		fields: [wishlists.user_id],
		references: [users.id]
	}),
}));

export const wishlist_items = pgTable('wishlist_items', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	wishlist_id: varchar('wishlist_id', {
		length: 255
	})
		.notNull()
		.references(() => wishlists.id, { onDelete: 'cascade' }),
	game_id: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
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
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	type: externalIdType('type').notNull(),
	externalId: varchar('external_id', {
		length: 255
	}).notNull()
});

export type ExternalIds = InferSelectModel<typeof externalIds>;

export const games = pgTable(
	'games',
	{
		id: varchar('id', {
			length: 255
		})
			.primaryKey()
			.$defaultFn(() => nanoid()),
		name: varchar('name', {
			length: 255
		}),
		slug: varchar('slug', {
			length: 255
		}),
		description: text('description'),
		year_published: integer('year_published'),
		min_players: integer('min_players'),
		max_players: integer('max_players'),
		playtime: integer('playtime'),
		min_playtime: integer('min_playtime'),
		max_playtime: integer('max_playtime'),
		min_age: integer('min_age'),
		image_url: varchar('image_url', {
			length: 255
		}),
		thumb_url: varchar('thumb_url', {
			length: 255
		}),
		url: varchar('url', {
			length: 255
		}),
		text_searchable_index: tsvector('text_searchable_index'),
		last_sync_at: timestamp('last_sync_at', {
			withTimezone: true,
			mode: 'date',
			precision: 6
		}),
		created_at: timestamp('created_at', {
			withTimezone: true,
			mode: 'date',
			precision: 6
		}).default(sql`now()`),
		updated_at: timestamp('updated_at', {
			withTimezone: true,
			mode: 'date',
			precision: 6
		}).default(sql`now()`)
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
		gameId: varchar('game_id', {
			length: 255
		})
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: varchar('external_id', {
			length: 255
		})
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
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	base_game_id: varchar('base_game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
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
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name', {
		length: 255
	}),
	slug: varchar('slug', {
		length: 255
	}),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export type Publishers = InferSelectModel<typeof publishers>;

export const publishersToExternalIds = pgTable('publishers_to_external_ids', {
	publisherId: varchar('publisher_id', {
		length: 255
	})
		.notNull()
		.references(() => publishers.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	externalId: varchar('external_id', {
		length: 255
	})
		.notNull()
		.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
}, (table) => {
	return {
		publishersToExternalIdsPkey: primaryKey({
			columns: [table.publisherId, table.externalId]
		})
	}
});

export const publishers_relations = relations(publishers, ({ many }) => ({
	publishers_to_games: many(publishers_to_games),
	publishersToExternalIds: many(publishersToExternalIds)
}));

export const categories = pgTable('categories', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name', {
		length: 255
	}),
	slug: varchar('slug', {
		length: 255
	}),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export type Categories = InferSelectModel<typeof categories>;

export const categoriesToExternalIds = pgTable('categories_to_external_ids', {
	categoryId: varchar('category_id', {
		length: 255
	})
		.notNull()
		.references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	externalId: varchar('external_id', {
		length: 255
	})
		.notNull()
		.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
}, (table) => {
	return {
		categoriesToExternalIdsPkey: primaryKey({
			columns: [table.categoryId, table.externalId]
		})
	}
});

export const categories_to_games = pgTable('categories_to_games', {
	category_id: varchar('category_id', {
		length: 255
	})
		.notNull()
		.references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' })
}, (table) => {
	return {
		categoriesToGamesPkey: primaryKey({
			columns: [table.category_id, table.game_id]
		})
	}
});

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
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	name: varchar('name', {
		length: 255
	}),
	slug: varchar('slug', {
		length: 255
	}),
	created_at: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`),
	updated_at: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
		precision: 6
	}).default(sql`now()`)
});

export type Mechanics = InferSelectModel<typeof mechanics>;

export const mechanicsToExternalIds = pgTable('mechanics_to_external_ids', {
	mechanicId: varchar('mechanic_id', {
		length: 255
	})
		.notNull()
		.references(() => mechanics.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	externalId: varchar('external_id', {
		length: 255
	})
		.notNull()
		.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' })
}, (table) => {
	return {
		mechanicsToExternalIdsPkey: primaryKey({
			columns: [table.mechanicId, table.externalId]
		})
	}
});

export const mechanic_relations = relations(mechanics, ({ many }) => ({
	mechanics_to_games: many(mechanics_to_games),
	mechanicsToExternalIds: many(mechanicsToExternalIds)
}));

export const mechanics_to_games = pgTable('mechanics_to_games', {
	mechanic_id: varchar('mechanic_id', {
		length: 255
	})
		.notNull()
		.references(() => mechanics.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' })
}, (table) => {
	return {
		mechanicsToGamesPkey: primaryKey({
			columns: [table.mechanic_id, table.game_id]
		})
	}
});

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

export const publishers_to_games = pgTable('publishers_to_games', {
	publisher_id: varchar('publisher_id', {
		length: 255
	})
		.notNull()
		.references(() => publishers.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	game_id: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' })
}, (table) => {
	return {
		publishersToGamesPkey: primaryKey({
			columns: [table.publisher_id, table.game_id]
		})
	}
});

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
