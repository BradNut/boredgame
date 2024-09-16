import { inject, injectable } from "tsyringe";
import { DrizzleService } from "../services/drizzle.service";
import { and, eq, type InferInsertModel } from "drizzle-orm";
import { federatedIdentityTable } from "../databases/tables";
import { takeFirstOrThrow } from "../common/utils/repository";

export type CreateFederatedIdentity = InferInsertModel<typeof federatedIdentityTable>

@injectable()
export class FederatedIdentityRepository {

	constructor(
		@inject(DrizzleService) private readonly drizzle: DrizzleService
	) { }

	async findOneByUserIdAndProvider(userId: string, provider: string) {
		return this.drizzle.db.query.federatedIdentityTable.findFirst({
			where: and(eq(federatedIdentityTable.user_id, userId), eq(federatedIdentityTable.identity_provider, provider))
		})
	}

	async create(data: CreateFederatedIdentity, db = this.drizzle.db) {
		return db.insert(federatedIdentityTable).values(data).returning().then(takeFirstOrThrow)
	}
}