import { type InferInsertModel, and, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository'
import { federatedIdentityTable } from '../databases/tables'
import { DrizzleService } from '../services/drizzle.service'

export type CreateFederatedIdentity = InferInsertModel<typeof federatedIdentityTable>

@injectable()
export class FederatedIdentityRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findOneByUserIdAndProvider(userId: string, provider: string) {
		return this.drizzle.db.query.federatedIdentityTable.findFirst({
			where: and(eq(federatedIdentityTable.user_id, userId), eq(federatedIdentityTable.identity_provider, provider)),
		})
	}

	async findOneByFederatedUserIdAndProvider(federatedUserId: string, provider: string) {
		return this.drizzle.db.query.federatedIdentityTable.findFirst({
			where: and(eq(federatedIdentityTable.federated_user_id, federatedUserId), eq(federatedIdentityTable.identity_provider, provider)),
		})
	}

	async create(data: CreateFederatedIdentity, db = this.drizzle.db) {
		return db.insert(federatedIdentityTable).values(data).returning().then(takeFirstOrThrow)
	}
}
