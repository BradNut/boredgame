import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { externalIdsTable } from './externalIds.table';
import { gamesTable } from './games.table';

export const gamesToExternalIdsTable = pgTable(
	'games_to_external_ids',
	{
		gameId: uuid()
			.notNull()
			.references(() => gamesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid()
			.notNull()
			.references(() => externalIdsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			gamesToExternalIdsPkey: primaryKey({
				columns: [table.gameId, table.externalId],
			}),
		};
	},
);

export const gamesToExternalIdsRelations = relations(gamesToExternalIdsTable, ({ one }) => ({
	game: one(gamesTable, {
		fields: [gamesToExternalIdsTable.gameId],
		references: [gamesTable.id],
	}),
	externalId: one(externalIdsTable, {
		fields: [gamesToExternalIdsTable.externalId],
		references: [externalIdsTable.id],
	}),
}));
