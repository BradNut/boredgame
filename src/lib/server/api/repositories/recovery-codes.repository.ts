import 'reflect-metadata'
import { DrizzleService } from '$lib/server/api/services/drizzle.service'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { recoveryCodesTable } from '../databases/tables'

export type CreateRecoveryCodes = InferInsertModel<typeof recoveryCodesTable>

@injectable()
export class RecoveryCodesRepository {
	constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) {}

	async findAllByUserId(userId: string, db = this.drizzle.db) {
		return db.query.recoveryCodesTable.findFirst({
			where: eq(recoveryCodesTable.userId, userId),
		})
	}

	async deleteAllByUserId(userId: string, db = this.drizzle.db) {
		return db.delete(recoveryCodesTable).where(eq(recoveryCodesTable.userId, userId))
	}
}
