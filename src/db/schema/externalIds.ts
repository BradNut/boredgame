import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createId as cuid2 } from '@paralleldrive/cuid2';
import type { InferSelectModel } from 'drizzle-orm';

export const externalIdType = pgEnum('external_id_type', [
	'game',
	'category',
	'mechanic',
	'publisher',
	'designer',
	'artist',
]);

const externalIds = pgTable('external_ids', {
	id: uuid('id').primaryKey().defaultRandom(),
	cuid: text('cuid')
		.unique()
		.$defaultFn(() => cuid2()),
	type: externalIdType('type'),
	externalId: text('external_id').notNull(),
});

export type ExternalIds = InferSelectModel<typeof externalIds>;

export default externalIds;
