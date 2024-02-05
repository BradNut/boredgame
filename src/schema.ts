import { relations, sql } from 'drizzle-orm';
import { mysqlTable, datetime, varchar, boolean, timestamp, year, int, text } from 'drizzle-orm/mysql-core';
import { nanoid } from 'nanoid';

// model User {
//   id                String        @id @default(cuid())
//   username          String        @unique
//   hashed_password   String?
//   email             String?       @unique
//   firstName         String?
//   lastName          String?
//   roles             UserRole[]
//   verified          Boolean       @default(false)
//   receiveEmail      Boolean       @default(false)
//   collection        Collection?
//   wishlist          Wishlist?
//   list              List[]
//   theme             String        @default("system")
//   created_at        DateTime      @default(now()) @db.Timestamp(6)
//   updated_at        DateTime      @updatedAt @db.Timestamp(6)
//   sessions          Session[]

//   @@map("users")
// }

export const users = mysqlTable("users", {
	id: varchar("id", {
		length: 255
	}).primaryKey()
		.$defaultFn(() => nanoid()),
	username: varchar("username", {
		length: 255
	}).unique(),
	hashedPassword: varchar("hashed_password", {
		length: 255
	}),
	email: varchar("email", {
		length: 255
	}).unique(),
	firstName: varchar("first_name", {
		length: 255
	}),
	lastName: varchar("last_name", {
		length: 255
	}),
	verified: boolean("verified").default(false),
	receiveEmail: boolean("receive_email").default(false),
	theme: varchar("theme", {
		length: 255
	}).default("system"),
	createdAt: datetime("created_at").default(sql`(now(6))`),
	updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const user_relations = relations(users, ({ many }) => ({
  user_roles: many(user_roles)
}));

// model Session {
//   id             String     @id @unique
//   userId         String
//   ip_country     String
//   ip_address     String
//   expiresAt      DateTime
//   user           User       @relation(references: [id], fields: [userId], onDelete: Cascade)

//   @@index([userId])
//   @@map("sessions")
// }

export const sessions = mysqlTable("sessions", {
	id: varchar("id", {
		length: 255
	}).primaryKey()
		.$defaultFn(() => nanoid()),
	userId: varchar("user_id", {
		length: 255
	})
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	ipCountry: varchar("ip_country", {
		length: 255
	}),
	ipAddress: varchar("ip_address", {
		length: 255
	}),
	expiresAt: datetime("expires_at").notNull()
});

// model Role {
//   id        String      @id @default(cuid())
//   name      String      @unique
//   userRoles UserRole[]

//   @@map("roles")
// }

export const roles = mysqlTable("roles", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }).unique()
});

// model UserRole {
//   id          String    @id @default(cuid())
//   user        User      @relation(fields: [user_id], references: [id])
//   user_id     String
//   role        Role      @relation(fields: [role_id], references: [id])
//   role_id     String
//   created_at  DateTime  @default(now()) @db.Timestamp(6)
//   updated_at  DateTime  @updatedAt  @db.Timestamp(6)

//   @@unique([user_id, role_id])
//   @@index([user_id])
//   @@index([role_id])
//   @@map("user_roles")
// }

export const user_roles = mysqlTable("user_roles", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  userId: varchar("user_id", {
    length: 255
  })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  roleId: varchar("role_id", {
    length: 255
  })
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const user_role_relations = relations(user_roles, ({ one }) => ({
	role: one(roles, {
		fields: [user_roles.roleId],
		references: [roles.id]
  }),
  user: one(users, {
    fields: [user_roles.userId],
    references: [users.id]
  })
}));

// model Game {
//   id                      String              @id @default(cuid())
//   name                    String
//   slug                    String
//   description             String?             @db.LongText
//   year_published          Int?                @db.Year
//   min_players             Int?
//   max_players             Int?
//   playtime                Int?
//   min_playtime            Int?
//   max_playtime            Int?
//   min_age                 Int?
//   image_url               String?
//   thumb_url               String?
//   url                     String?
//   rules_url               String?
//   categories              Category[]
//   mechanics               Mechanic[]
//   designers               Designer[]
//   publishers              Publisher[]
//   artists                 Artist[]
//   names                   GameName[]
//   expansions              Expansion[]         @relation("BaseToExpansion")
//   expansion_of            Expansion[]         @relation("ExpansionToBase")
//   collection_items        CollectionItem[]
//   wishlist_items          WishlistItem[]
//   list_items              ListItem[]
//   external_id             Int                 @unique
//   last_sync_at            DateTime?           @db.Timestamp(6)
//   created_at              DateTime            @default(now()) @db.Timestamp(6)
//   updated_at              DateTime            @updatedAt @db.Timestamp(6)

//   @@fulltext([name])
//   @@fulltext([slug])
//   @@map("games")
// }

export const games = mysqlTable("games", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }),
  slug: varchar("slug", {
    length: 255
  }),
  description: text("description"),
  yearPublished: year("year_published"),
  minPlayers: int("min_players"),
  maxPlayers: int("max_players"),
  playtime: int("playtime"),
  minPlaytime: int("min_playtime"),
  maxPlaytime: int("max_playtime"),
  minAge: int("min_age"),
  imageUrl: varchar("image_url", {
    length: 255
  }),
  thumbUrl: varchar("thumb_url", {
    length: 255
  }),
  url: varchar("url", {
    length: 255
  }),
  externalId: int("external_id").unique(),
  lastSyncAt: datetime("last_sync_at"),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const gameRelations = relations(games, ({ many }) => ({
  categories_to_games: many(categories_to_games),
  mechanics_to_games: many(mechanics_to_games),
  designers_to_games: many(designers_to_games),
  publishers_to_games: many(publishers_to_games),
  artists_to_games: many(artists_to_games),
}))

// model Expansion {
//   id              String    @id @default(cuid())
//   base_game       Game      @relation(name: "BaseToExpansion", fields: [base_game_id], references: [id])
//   base_game_id    String
//   game            Game      @relation(name: "ExpansionToBase", fields: [game_id], references: [id])
//   game_id         String
//   created_at      DateTime  @default(now()) @db.Timestamp(6)
//   updated_at      DateTime  @updatedAt @db.Timestamp(6)

//   @@index([base_game_id])
//   @@index([game_id])
//   @@map("expansions")
// }

export const expansions = mysqlTable("expansions", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  baseGameId: varchar("base_game_id", {
    length: 255
  })
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  gameId: varchar("game_id", {
    length: 255
  })
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
})

export const expansion_relations = relations(expansions, ({ one }) => ({
  baseGame: one(games, {
    fields: [expansions.baseGameId],
    references: [games.id]
  }),
  game: one(games, {
    fields: [expansions.gameId],
    references: [games.id]
  })
}));

// model Collection {
//   id                String               @id @default(cuid())
//   user_id           String          @unique
//   user              User               @relation(references: [id], fields: [user_id])
//   items CollectionItem[]

//   @@index([user_id])
//   @@map("collections")
// }

export const collections = mysqlTable("collections", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  userId: varchar("user_id", {
    length: 255
  })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const collection_relations = relations(collections, ({ one }) => ({
  user: one(users, {
    fields: [collections.userId],
    references: [users.id]
  }),
}))

// model CollectionItem {
//   id String               @id @default(cuid())
//   collection_id String
//   collection Collection   @relation(references: [id], fields: [collection_id], onDelete: Cascade)
//   game_id String          @unique
//   game Game               @relation(references: [id], fields: [game_id])
//   times_played Int

//   @@index([game_id, collection_id])
//   @@index([game_id])
//   @@index([collection_id])
//   @@map("collection_items")
// }

export const collection_items = mysqlTable("collection_items", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  collectionId: varchar("collection_id", {
    length: 255
  })
    .notNull()
    .references(() => collections.id, { onDelete: 'cascade' }),
  gameId: varchar("game_id", {
    length: 255
  })
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const collection_item_relations = relations(collection_items, ({ one }) =>({
  collection: one(collections, {
    fields: [collection_items.collectionId],
    references: [collections.id]
  }),
  game: one(games, {
    fields: [collection_items.gameId],
    references: [games.id]
  })
}));

// model Wishlist {
//   id String             @id @default(cuid())
//   user_id String        @unique
//   user User             @relation(references: [id], fields: [user_id])
//   items WishlistItem[]

//   @@index([user_id])
//   @@map("wishlists")
// }

export const wishlists = mysqlTable("wishlists", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  userId: varchar("user_id", {
    length: 255
  })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const wishlists_relations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id]
  }),
}))

// model WishlistItem {
//   id String                         @id @default(cuid())
//   wishlist_id String
//   wishlist Wishlist                 @relation(references: [id], fields: [wishlist_id], onDelete: Cascade)
//   game_id String                    @unique
//   game Game                         @relation(references: [id], fields: [game_id])
//   created_at DateTime               @default(now()) @db.Timestamp(6)
//   updated_at DateTime               @updatedAt @db.Timestamp(6)

//   @@index([game_id, wishlist_id])
//   @@index([game_id])
//   @@index([wishlist_id])
//   @@map("wishlist_items")
// }

export const wishlist_items = mysqlTable('wishlist_items', {
	id: varchar('id', {
		length: 255
	})
		.primaryKey()
		.$defaultFn(() => nanoid()),
	wishlistId: varchar('wishlist_id', {
		length: 255
	})
		.notNull()
		.references(() => wishlists.id, { onDelete: 'cascade' }),
	gameId: varchar('game_id', {
		length: 255
	})
		.notNull()
		.references(() => games.id, { onDelete: 'cascade' }),
	createdAt: datetime('created_at').default(sql`(now(6))`),
	updatedAt: datetime('updated_at').default(sql`(now(6))`)
});

export const wishlist_item_relations = relations(wishlist_items, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlist_items.wishlistId],
    references: [wishlists.id]
  }),
  game: one(games, {
    fields: [wishlist_items.gameId],
    references: [games.id]
  })
}))

// model List {
//   id String         @id @default(cuid())
//   name String
//   user_id String    @unique
//   user User         @relation(references: [id], fields: [user_id])
//   items ListItem[]

//   @@index([user_id])
//   @@map("lists")
// }

// model ListItem {
//   id String                     @id @default(cuid())
//   list_id String
//   list List                     @relation(references: [id], fields: [list_id], onDelete: Cascade)
//   game_id String                @unique
//   game Game                     @relation(references: [id], fields: [game_id])
//   created_at DateTime           @default(now()) @db.Timestamp(6)
//   updated_at DateTime           @updatedAt @db.Timestamp(6)

//   @@index([game_id, list_id])
//   @@index([game_id])
//   @@index([list_id])
//   @@map("list_items")
// }

// model GameName {
//   id          String    @id @default(cuid())
//   name        String
//   slug        String
//   game_id     String
//   game        Game      @relation(references: [id], fields: [game_id])
//   created_at  DateTime  @default(now()) @db.Timestamp(6)
//   updated_at  DateTime  @updatedAt @db.Timestamp(6)

//   @@index([game_id])
//   @@map("game_names")
// }

// model Publisher {
//   id                  String    @id @default(cuid())
//   name                String
//   slug                String
//   external_id         Int       @unique
//   games               Game[]
//   created_at          DateTime  @default(now()) @db.Timestamp(6)
//   updated_at          DateTime  @updatedAt @db.Timestamp(6)

//   @@fulltext([name])
//   @@map("publishers")
// }

export const publishers = mysqlTable("publishers", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }),
  slug: varchar("slug", {
    length: 255
  }),
  externalId: int("external_id"),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const publishers_relations = relations(publishers, ({ many }) => ({
  publishers_to_games: many(publishers_to_games)
}));

// model Category {
//   id            String    @id @default(cuid())
//   name          String
//   slug          String
//   games         Game[]
//   external_id   Int       @unique
//   created_at    DateTime  @default(now()) @db.Timestamp(6)
//   updated_at    DateTime  @updatedAt @db.Timestamp(6)

//   @@fulltext([name])
//   @@map("categories")
// }

export const categories = mysqlTable("categories", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }),
  slug: varchar("slug", {
    length: 255
  }),
  externalId: int("external_id"),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const categories_relations = relations(categories, ({ many }) => ({
  categories_to_games: many(categories_to_games)
}));

// model Mechanic {
//   id            String    @id @default(cuid())
//   name          String
//   slug          String
//   games         Game[]
//   external_id   Int       @unique
//   created_at    DateTime  @default(now()) @db.Timestamp(6)
//   updated_at    DateTime  @updatedAt @db.Timestamp(6)

//   @@fulltext([name])
//   @@map("mechanics")
// }

export const mechanics = mysqlTable("mechanics", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }),
  slug: varchar("slug", {
    length: 255
  }),
  externalId: int("external_id"),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const mechanic_relations = relations(mechanics, ({ many }) => ({
  mechanics_to_games: many(mechanics_to_games)
}))

// model Designer {
//   id                String    @id @default(cuid())
//   name              String
//   slug              String
//   external_id       Int       @unique
//   games             Game[]
//   created_at        DateTime  @default(now()) @db.Timestamp(6)
//   updated_at        DateTime  @updatedAt @db.Timestamp(6)

//   @@fulltext([name])
//   @@map("designers")
// }

export const designers = mysqlTable("designers", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }),
  slug: varchar("slug", {
    length: 255
  }),
  externalId: int("external_id"),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const designers_relations = relations(designers, ({ many }) => ({
  designers_to_games: many(designers_to_games)
}));

// model Artist {
//   id            String    @id @default(cuid())
//   name          String
//   slug          String    @unique
//   external_id   Int       @unique
//   games         Game[]
//   created_at    DateTime  @default(now()) @db.Timestamp(6)
//   updated_at    DateTime  @updatedAt @db.Timestamp(6)

//   @@fulltext([name])
//   @@map("artists")
// }

export const artists = mysqlTable("artists", {
  id: varchar("id", {
    length: 255
  }).primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", {
    length: 255
  }),
  slug: varchar("slug", {
    length: 255
  }),
  externalId: int("external_id"),
  createdAt: datetime("created_at").default(sql`(now(6))`),
  updatedAt: datetime("updated_at").default(sql`(now(6))`)
});

export const artists_relations = relations(artists, ({ many }) => ({
	artists_to_games: many(artists_to_games)
}));

export const artists_to_games = mysqlTable('artists_to_games', {
	artistId: varchar('artist_id', {
		length: 255
	}),
	gameId: varchar('game_id', {
		length: 255
	}),
});

export const artists_to_games_relations = relations(artists_to_games, ({ one }) => ({
  artist: one(artists, {
    fields: [artists_to_games.artistId],
    references: [artists.id]
  }),
  game: one(games, {
    fields: [artists_to_games.gameId],
    references: [games.id]
  }),
}));

export const categories_to_games = mysqlTable("categories_to_games", {
  categoryId: varchar("category_id", {
    length: 255
  }),
  gameId: varchar("game_id", {
    length: 255
  }),
});

export const categories_to_games_relations = relations(categories_to_games, ({ one }) => ({
  category: one(categories, {
    fields: [categories_to_games.categoryId],
    references: [categories.id]
  }),
  game: one(games, {
    fields: [categories_to_games.gameId],
    references: [games.id]
  }),
}))

export const designers_to_games = mysqlTable("designers_to_games", {
  designerId: varchar("designer_id", {
    length: 255
  }),
  gameId: varchar("game_id", {
    length: 255
  }),
});

export const designers_to_games_relations = relations(designers_to_games, ({ one }) => ({
  designer: one(designers, {
    fields: [designers_to_games.designerId],
    references: [designers.id]
  }),
  game: one(games, {
    fields: [designers_to_games.gameId],
    references: [games.id]
  }),
}))

export const mechanics_to_games = mysqlTable("mechanics_to_games", {
  mechanicId: varchar("mechanic_id", {
    length: 255
  }),
  gameId: varchar("game_id", {
    length: 255
  }),
});

export const mechanics_to_games_relations = relations(mechanics_to_games, ({ one }) => ({
  mechanic: one(mechanics, {
    fields: [mechanics_to_games.mechanicId],
    references: [mechanics.id]
  }),
  game: one(games, {
    fields: [mechanics_to_games.gameId],
    references: [games.id]
  }),
}));

export const publishers_to_games = mysqlTable("publishers_to_games", {
  publisherId: varchar("publisher_id", {
    length: 255
  }),
  gameId: varchar("game_id", {
    length: 255
  }),
});

export const publishers_to_games_relations = relations(publishers_to_games, ({ one }) => ({
  publisher: one(publishers, {
    fields: [publishers_to_games.publisherId],
    references: [publishers.id]
  }),
  game: one(games, {
    fields: [publishers_to_games.gameId],
    references: [games.id]
  }),
}));
