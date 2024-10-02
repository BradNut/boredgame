import 'reflect-metadata'
import { takeFirstOrThrow } from '$lib/server/api/common/utils/repository'
import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { recoveryCodesTable } from '../databases/tables'

export type CreateRecoveryCodes = InferInsertModel<typeof recoveryCodesTable>

@injectable()
export class RecoveryCodesRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async create(data: CreateRecoveryCodes, db = this.drizzle.db) {
		return db.insert(recoveryCodesTable).values(data).returning().then(takeFirstOrThrow)
	}

	async findAllByUserId(userId: string, db = this.drizzle.db) {
		return db.query.recoveryCodesTable.findMany({
			where: eq(recoveryCodesTable.userId, userId),
		})
	}

	async deleteAllByUserId(userId: string, db = this.drizzle.db) {
		return db.delete(recoveryCodesTable).where(eq(recoveryCodesTable.userId, userId))
	}
}
