import type { Repository } from '$lib/server/api/common/interfaces/repository.interface'
import { DatabaseProvider } from '$lib/server/api/providers/database.provider'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository.utils'
import { wishlists } from '../databases/tables'

export type CreateWishlist = InferInsertModel<typeof wishlists>
export type UpdateWishlist = Partial<CreateWishlist>

@injectable()
export class WishlistsRepository implements Repository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) {}

	async findAll() {
		return this.db.query.wishlists.findMany()
	}

	async findOneById(id: string) {
		return this.db.query.wishlists.findFirst({
			where: eq(wishlists.id, id),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByCuid(cuid: string) {
		return this.db.query.wishlists.findFirst({
			where: eq(wishlists.cuid, cuid),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByUserId(userId: string) {
		return this.db.query.wishlists.findFirst({
			where: eq(wishlists.user_id, userId),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findAllByUserId(userId: string) {
		return this.db.query.wishlists.findMany({
			where: eq(wishlists.user_id, userId),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async create(data: CreateWishlist) {
		return this.db.insert(wishlists).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateWishlist) {
		return this.db.update(wishlists).set(data).where(eq(wishlists.id, id)).returning().then(takeFirstOrThrow)
	}

	trxHost(trx: DatabaseProvider) {
		return new WishlistsRepository(trx)
	}
}
