import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository'
import { wishlistsTable } from '../databases/tables'

export type CreateWishlist = InferInsertModel<typeof wishlistsTable>
export type UpdateWishlist = Partial<CreateWishlist>

@injectable()
export class WishlistsRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findAll(db = this.drizzle.db) {
		return db.query.wishlistsTable.findMany()
	}

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.wishlistsTable.findFirst({
			where: eq(wishlistsTable.id, id),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByCuid(cuid: string, db = this.drizzle.db) {
		return db.query.wishlistsTable.findFirst({
			where: eq(wishlistsTable.cuid, cuid),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findOneByUserId(userId: string, db = this.drizzle.db) {
		return db.query.wishlistsTable.findFirst({
			where: eq(wishlistsTable.user_id, userId),
			columns: {
				cuid: true,
				name: true,
			},
		})
	}

	async findAllByUserId(userId: string, db = this.drizzle.db) {
		return db.query.wishlistsTable.findMany({
			where: eq(wishlistsTable.user_id, userId),
			columns: {
				cuid: true,
				name: true,
				createdAt: true,
			},
		})
	}

	async create(data: CreateWishlist, db = this.drizzle.db) {
		return db.insert(wishlistsTable).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateWishlist, db = this.drizzle.db) {
		return db.update(wishlistsTable).set(data).where(eq(wishlistsTable.id, id)).returning().then(takeFirstOrThrow)
	}
}
