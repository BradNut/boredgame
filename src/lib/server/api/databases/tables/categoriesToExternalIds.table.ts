import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { categoriesTable } from './categories.table'
import { externalIdsTable } from './externalIds.table'

export const categoriesToExternalIdsTable = pgTable(
	'categories_to_external_ids',
	{
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categoriesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIdsTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			categoriesToExternalIdsPkey: primaryKey({
				columns: [table.categoryId, table.externalId],
			}),
		}
	},
)

export const categoriesToExternalIdsRelations = relations(categoriesToExternalIdsTable, ({ one }) => ({
	category: one(categoriesTable, {
		fields: [categoriesToExternalIdsTable.categoryId],
		references: [categoriesTable.id],
	}),
	externalId: one(externalIdsTable, {
		fields: [categoriesToExternalIdsTable.externalId],
		references: [externalIdsTable.id],
	}),
}))
