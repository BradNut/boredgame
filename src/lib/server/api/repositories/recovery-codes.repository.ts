import 'reflect-metadata'
import type { Repository } from '$lib/server/api/common/interfaces/repository.interface'
import { DatabaseProvider } from '$lib/server/api/providers/database.provider'
import { type InferInsertModel, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { recoveryCodesTable } from '../databases/tables'

export type CreateRecoveryCodes = InferInsertModel<typeof recoveryCodesTable>

@injectable()
export class RecoveryCodesRepository implements Repository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) {}

	async findAllByUserId(userId: string) {
		return this.db.query.recoveryCodesTable.findFirst({
			where: eq(recoveryCodesTable.userId, userId),
		})
	}

	async deleteAllByUserId(userId: string) {
		return this.db.delete(recoveryCodesTable).where(eq(recoveryCodesTable.userId, userId))
	}

	trxHost(trx: DatabaseProvider) {
		return new RecoveryCodesRepository(trx)
	}
}
