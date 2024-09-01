import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import {publishers} from './publishers';
import {externalIds} from './externalIds';

export const publishersToExternalIds = pgTable(
	'publishers_to_external_ids',
	{
		publisherId: uuid('publisher_id')
			.notNull()
			.references(() => publishers.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			publishersToExternalIdsPkey: primaryKey({
				columns: [table.publisherId, table.externalId],
			}),
		};
	},
);
