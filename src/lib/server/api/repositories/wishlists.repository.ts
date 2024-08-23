import {inject, injectable} from "tsyringe";
import {DatabaseProvider} from "$lib/server/api/providers";
import { eq, type InferInsertModel } from "drizzle-orm";
import { wishlists } from "../infrastructure/database/tables";
import { takeFirstOrThrow } from "../infrastructure/database/utils";

export type CreateWishlist = InferInsertModel<typeof wishlists>;
export type UpdateWishlist = Partial<CreateWishlist>;

@injectable()
export class WishlistsRepository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider){ }

	async findAll() {
		return this.db.query.wishlists.findMany();
	}

	async findOneById(id: string) {
		return this.db.query.wishlists.findFirst({
			where: eq(wishlists.id, id),
			columns: {
				cuid: true,
				name: true
			}
		})
	}

	async findOneByCuid(cuid: string) {
		return this.db.query.wishlists.findFirst({
			where: eq(wishlists.cuid, cuid),
			columns: {
				cuid: true,
				name: true
			}
		})
	}

	async findOneByUserId(userId: string) {
		return this.db.query.wishlists.findFirst({
			where: eq(wishlists.user_id, userId),
			columns: {
				cuid: true,
				name: true
			}
		})
	}

	async findAllByUserId(userId: string) {
		return this.db.query.wishlists.findMany({
			where: eq(wishlists.user_id, userId),
			columns: {
				cuid: true,
				name: true
			}
		})
	}

	async create(data: CreateWishlist) {
		return this.db.insert(wishlists).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateWishlist) {
		return this.db
			.update(wishlists)
			.set(data)
			.where(eq(wishlists.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}
}