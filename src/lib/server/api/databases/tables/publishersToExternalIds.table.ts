import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { externalIdsTable } from './externalIds.table'
import { publishersTable } from './publishers.table'

export const publishersToExternalIdsTable = pgTable(
	'publishers_to_external_ids',
	{
		publisherId: uuid('publisher_id')
			.notNull()
			.references(() => publishersTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIdsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			publishersToExternalIdsPkey: primaryKey({
				columns: [table.publisherId, table.externalId],
			}),
		}
	},
)
