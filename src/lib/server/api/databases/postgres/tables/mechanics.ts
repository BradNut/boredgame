import {createId as cuid2} from '@paralleldrive/cuid2';
import {type InferSelectModel, relations} from 'drizzle-orm';
import {pgTable, text, uuid} from 'drizzle-orm/pg-core';
import {timestamps} from '../../../common/utils/table';
import {mechanicsToExternalIdsTable} from './mechanicsToExternalIds.table';
import {mechanics_to_games} from './mechanicsToGames.table';

export const mechanics = pgTable('mechanics', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	name: text(),
	slug: text(),
	...timestamps,
});

export type Mechanics = InferSelectModel<typeof mechanics>;

export const mechanics_relations = relations(mechanics, ({ many }) => ({
	mechanics_to_games: many(mechanics_to_games),
	mechanicsToExternalIds: many(mechanicsToExternalIdsTable),
}));
