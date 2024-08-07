import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import {mechanics} from './mechanics';
import {externalIds} from './externalIds';

export const mechanicsToExternalIds = pgTable(
	'mechanics_to_external_ids',
	{
		mechanicId: uuid('mechanic_id')
			.notNull()
			.references(() => mechanics.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			mechanicsToExternalIdsPkey: primaryKey({
				columns: [table.mechanicId, table.externalId],
			}),
		};
	},
);
