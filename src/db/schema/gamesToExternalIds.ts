import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import games from './games';
import externalIds from './externalIds';

const gamesToExternalIds = pgTable(
	'games_to_external_ids',
	{
		gameId: uuid('game_id')
			.notNull()
			.references(() => games.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			gamesToExternalIdsPkey: primaryKey({
				columns: [table.gameId, table.externalId],
			}),
		};
	},
);

export default gamesToExternalIds;
