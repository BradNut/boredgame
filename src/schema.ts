import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import { pgTable, timestamp, varchar, boolean, integer, text, index } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { tsvector } from './tsVector';

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
	created_at: timestamp('created_at').default(sql`now()`),
	updated_at: timestamp('updated_at').default(sql`now()`)
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

export const games = pgTable('games', {
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
	external_id: integer('external_id').unique(),
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
}, (table) => {
  return {
    text_searchable_idx: index("text_searchable_idx").on(table.text_searchable_index).using(sql`'gin'`)
  }
});

export type Games = InferSelectModel<typeof games>;

export const gameRelations = relations(games, ({ many }) => ({
	categories_to_games: many(categories_to_games),
	mechanics_to_games: many(mechanics_to_games),
	designers_to_games: many(designers_to_games),
	publishers_to_games: many(publishers_to_games),
	artists_to_games: many(artists_to_games)
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
		.references(() => games.id, { onDelete: 'cascade' }),
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

export const wishlists_relations = relations(wishlists, ({ one }) => ({
	user: one(users, {
		fields: [wishlists.user_id],
		references: [users.id]
	})
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
	external_id: integer('external_id'),
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

export const publishers_relations = relations(publishers, ({ many }) => ({
	publishers_to_games: many(publishers_to_games)
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
	external_id: integer('external_id'),
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

export const categories_relations = relations(categories, ({ many }) => ({
	categories_to_games: many(categories_to_games)
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
	external_id: integer('external_id'),
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

export const mechanic_relations = relations(mechanics, ({ many }) => ({
	mechanics_to_games: many(mechanics_to_games)
}));

export const designers = pgTable('designers', {
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
	external_id: integer('external_id'),
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

export const designers_relations = relations(designers, ({ many }) => ({
	designers_to_games: many(designers_to_games)
}));

export const artists = pgTable('artists', {
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
	external_id: integer('external_id'),
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

export const artists_relations = relations(artists, ({ many }) => ({
	artists_to_games: many(artists_to_games)
}));

export const artists_to_games = pgTable('artists_to_games', {
	artist_id: varchar('artist_id', {
		length: 255
	}),
	game_id: varchar('game_id', {
		length: 255
	})
});

export const artists_to_games_relations = relations(artists_to_games, ({ one }) => ({
	artist: one(artists, {
		fields: [artists_to_games.artist_id],
		references: [artists.id]
	}),
	game: one(games, {
		fields: [artists_to_games.game_id],
		references: [games.id]
	})
}));

export const categories_to_games = pgTable('categories_to_games', {
	category_id: varchar('category_id', {
		length: 255
	}),
	game_id: varchar('game_id', {
		length: 255
	})
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

export const designers_to_games = pgTable('designers_to_games', {
	designer_id: varchar('designer_id', {
		length: 255
	}),
	game_id: varchar('game_id', {
		length: 255
	})
});

export const designers_to_games_relations = relations(designers_to_games, ({ one }) => ({
	designer: one(designers, {
		fields: [designers_to_games.designer_id],
		references: [designers.id]
	}),
	game: one(games, {
		fields: [designers_to_games.game_id],
		references: [games.id]
	})
}));

export const mechanics_to_games = pgTable('mechanics_to_games', {
	mechanic_id: varchar('mechanic_id', {
		length: 255
	}),
	game_id: varchar('game_id', {
		length: 255
	})
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
	}),
	game_id: varchar('game_id', {
		length: 255
	})
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
