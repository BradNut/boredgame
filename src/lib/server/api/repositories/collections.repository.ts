import {inject, injectable} from "tsyringe";
import { eq, type InferInsertModel } from "drizzle-orm";
import {DatabaseProvider} from "$lib/server/api/providers";
import { collections } from "../infrastructure/database/tables";
import { takeFirstOrThrow } from "../infrastructure/database/utils";

export type CreateCollection = InferInsertModel<typeof collections>;
export type UpdateCollection = Partial<CreateCollection>;

@injectable()
export class CollectionsRepository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

	async findAll() {
		return this.db.query.collections.findMany();
	}

	async findOneById(id: string) {
		return this.db.query.collections.findFirst({
			where: eq(collections.id, id)
		})
	}

	async findOneByUserId(userId: string) {
		return this.db.query.collections.findFirst({
			where: eq(collections.user_id, userId)
		})
	}

	async create(data: CreateCollection) {
		return this.db.insert(collections).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateCollection) {
		return this.db
			.update(collections)
			.set(data)
			.where(eq(collections.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}
}