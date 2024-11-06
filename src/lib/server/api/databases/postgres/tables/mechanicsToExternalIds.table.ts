import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { externalIdsTable } from './externalIds.table'
import { mechanicsTable } from './mechanics.table'
import { relations } from 'drizzle-orm'

export const mechanicsToExternalIdsTable = pgTable(
	'mechanics_to_external_ids',
	{
		mechanicId: uuid('mechanic_id')
			.notNull()
			.references(() => mechanicsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIdsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			mechanicsToExternalIdsPkey: primaryKey({
				columns: [table.mechanicId, table.externalId],
			}),
		}
	},
)

export const mechanicsToExternalIdsRelations = relations(mechanicsToExternalIdsTable, ({ one }) => ({
	mechanic: one(mechanicsTable, {
		fields: [mechanicsToExternalIdsTable.mechanicId],
		references: [mechanicsTable.id],
	}),
	externalId: one(externalIdsTable, {
		fields: [mechanicsToExternalIdsTable.externalId],
		references: [externalIdsTable.id],
	}),
}))
