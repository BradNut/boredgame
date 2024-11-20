import {takeFirstOrThrow} from '$lib/server/api/common/utils/repository';
import {DrizzleService} from '$lib/server/api/services/drizzle.service';
import {and, eq, type InferInsertModel} from 'drizzle-orm';
import {inject, injectable} from '@needle-di/core';
import {recoveryCodesTable} from '../databases/postgres/tables';

export type CreateRecoveryCodes = InferInsertModel<typeof recoveryCodesTable>;

@injectable()
export class RecoveryCodesRepository {
	constructor(private drizzle = inject(DrizzleService)) {}

	async create(data: CreateRecoveryCodes, db = this.drizzle.db) {
		return db.insert(recoveryCodesTable).values(data).returning().then(takeFirstOrThrow);
	}

	async findAllByUserId(userId: string, db = this.drizzle.db) {
		return db.query.recoveryCodesTable.findMany({
			where: eq(recoveryCodesTable.userId, userId),
		});
	}

	async findAllNotUsedByUserId(userId: string, db = this.drizzle.db) {
		return db.query.recoveryCodesTable.findMany({
			where: and(eq(recoveryCodesTable.userId, userId), eq(recoveryCodesTable.used, false)),
		});
	}

	async deleteAllByUserId(userId: string, db = this.drizzle.db) {
		return db.delete(recoveryCodesTable).where(eq(recoveryCodesTable.userId, userId));
	}
}
