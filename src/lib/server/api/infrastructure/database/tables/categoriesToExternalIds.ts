import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import categories from './categories';
import externalIds from './externalIds';
import { relations } from 'drizzle-orm';

const categoriesToExternalIds = pgTable(
	'categories_to_external_ids',
	{
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
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
	categoriesToExternalIds,
	({ one }) => ({
		category: one(categories, {
			fields: [categoriesToExternalIds.categoryId],
			references: [categories.id],
		}),
		externalId: one(externalIds, {
			fields: [categoriesToExternalIds.externalId],
			references: [externalIds.id],
		}),
	}),
);

export default categoriesToExternalIds;
