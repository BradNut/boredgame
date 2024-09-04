import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { categoriesTable } from './categories.table';
import { externalIds } from './externalIds';
import { relations } from 'drizzle-orm';

export const categoriesToExternalIdsTable = pgTable(
	'categories_to_external_ids',
	{
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categoriesTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		externalId: uuid('external_id')
			.notNull()
			.references(() => externalIds.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
	},
	(table) => {
		return {
			categoriesToExternalIdsPkey: primaryKey({
				columns: [table.categoryId, table.externalId],
			}),
		};
	},
);

export const categoriesToExternalIdsRelations = relations(
	categoriesToExternalIdsTable,
	({ one }) => ({
		category: one(categoriesTable, {
			fields: [categoriesToExternalIdsTable.categoryId],
			references: [categoriesTable.id],
		}),
		externalId: one(externalIds, {
			fields: [categoriesToExternalIdsTable.externalId],
			references: [externalIds.id],
		}),
	}),
);
