import type { Repository } from '$lib/server/api/common/interfaces/repository.interface'
import { takeFirstOrThrow } from '$lib/server/api/common/utils/repository.utils'
import { DatabaseProvider } from '$lib/server/api/providers/database.provider'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { collections } from '../databases/tables'

export type CreateCollection = InferInsertModel<typeof collections>
export type UpdateCollection = Partial<CreateCollection>

@injectable()
export class CollectionsRepository implements Repository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) {}

	async findAll() {
		return this.db.query.collections.findMany()
	}

	async findOneById(id: string) {
		return this.db.query.collections.findFirst({
			where: eq(collections.id, id),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByCuid(cuid: string) {
		return this.db.query.collections.findFirst({
			where: eq(collections.cuid, cuid),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByUserId(userId: string) {
		return this.db.query.collections.findFirst({
			where: eq(collections.user_id, userId),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findAllByUserId(userId: string) {
		return this.db.query.collections.findMany({
			where: eq(collections.user_id, userId),
		})
	}

	async create(data: CreateCollection) {
		return this.db.insert(collections).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateCollection) {
		return this.db.update(collections).set(data).where(eq(collections.id, id)).returning().then(takeFirstOrThrow)
	}

	trxHost(trx: DatabaseProvider) {
		return new CollectionsRepository(trx)
	}
}
