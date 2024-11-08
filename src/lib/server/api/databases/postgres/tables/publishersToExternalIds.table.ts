import {relations} from 'drizzle-orm';
import {pgTable, primaryKey, uuid} from 'drizzle-orm/pg-core';
import {externalIdsTable} from './externalIds.table';
import {publishersTable} from './publishers.table';

export const publishersToExternalIdsTable = pgTable(
	'publishers_to_external_ids',
	{
		publisherId: uuid()
			.notNull()
			.references(() => publishersTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid()
			.notNull()
			.references(() => externalIdsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			publishersToExternalIdsPkey: primaryKey({
				columns: [table.publisherId, table.externalId],
			}),
		};
	},
);

export const publishersToExternalIdsRelations = relations(publishersToExternalIdsTable, ({ one }) => ({
	publisher: one(publishersTable, {
		fields: [publishersToExternalIdsTable.publisherId],
		references: [publishersTable.id],
	}),
	externalId: one(externalIdsTable, {
		fields: [publishersToExternalIdsTable.externalId],
		references: [externalIdsTable.id],
	}),
}));
