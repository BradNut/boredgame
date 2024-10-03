import { takeFirstOrThrow } from '$lib/server/api/common/utils/repository'
import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { collections } from '../databases/tables'

export type CreateCollection = InferInsertModel<typeof collections>
export type UpdateCollection = Partial<CreateCollection>

@injectable()
export class CollectionsRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findAll(db = this.drizzle.db) {
		return db.query.collections.findMany()
	}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.collections.findFirst({
			where: eq(collections.id, id),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByCuid(cuid: string, db = this.drizzle.db) {
		return db.query.collections.findFirst({
			where: eq(collections.cuid, cuid),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByUserId(userId: string, db = this.drizzle.db) {
		return db.query.collections.findFirst({
			where: eq(collections.user_id, userId),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findAllByUserId(userId: string, db = this.drizzle.db) {
		return db.query.collections.findMany({
			where: eq(collections.user_id, userId),
			columns: {
				cuid: true,
				name: true,
				createdAt: true,
			},
		})
	}

	async findAllByUserIdWithDetails(userId: string, db = this.drizzle.db) {
		return db.query.collections.findMany({
			where: eq(collections.user_id, userId),
			columns: {
				cuid: true,
				name: true,
			},
			with: {
				collection_items: {
					columns: {
						cuid: true,
					},
				},
			},
		})
	}

	async create(data: CreateCollection, db = this.drizzle.db) {
		return db.insert(collections).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateCollection, db = this.drizzle.db) {
		return db.update(collections).set(data).where(eq(collections.id, id)).returning().then(takeFirstOrThrow)
	}
}
