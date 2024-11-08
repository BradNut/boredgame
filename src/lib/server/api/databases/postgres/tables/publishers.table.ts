import {createId as cuid2} from '@paralleldrive/cuid2';
import {type InferSelectModel, relations} from 'drizzle-orm';
import {pgTable, text, uuid} from 'drizzle-orm/pg-core';
import {timestamps} from '../../../common/utils/table';
import {publishersToExternalIdsTable} from './publishersToExternalIds.table';
import {publishers_to_games} from './publishersToGames.table';

export const publishersTable = pgTable('publishers', {
	id: uuid().primaryKey().defaultRandom(),
	cuid: text()
		.unique()
		.$defaultFn(() => cuid2()),
	name: text(),
	slug: text(),
	...timestamps,
});

export type Publishers = InferSelectModel<typeof publishersTable>;

export const publishers_relations = relations(publishersTable, ({ many }) => ({
	publishersToGames: many(publishers_to_games),
	publishersToExternalIds: many(publishersToExternalIdsTable),
}));
