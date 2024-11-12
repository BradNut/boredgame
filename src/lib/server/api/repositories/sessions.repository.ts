import {takeFirstOrThrow} from '$lib/server/api/common/utils/repository';
import {DrizzleService} from '$lib/server/api/services/drizzle.service';
import {eq, type InferInsertModel} from 'drizzle-orm';
import {inject, injectable} from '@needle-di/core';
import {sessionsTable, usersTable} from '../databases/postgres/tables';

export type CreateSession = InferInsertModel<typeof sessionsTable>;

@injectable()
export class SessionsRepository {
	constructor(private drizzle = inject(DrizzleService)) {}

	async create(data: CreateSession, db = this.drizzle.db) {
		return db.insert(sessionsTable).values(data).returning().then(takeFirstOrThrow);
	}

	async findBySessionId(sessionId: string, db = this.drizzle.db) {
		return await db
			.select({ user: usersTable, session: sessionsTable })
			.from(sessionsTable)
			.innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
			.where(eq(sessionsTable.id, sessionId));
	}

	async deleteBySessionId(sessionId: string, db = this.drizzle.db) {
		return db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
	}

	async updateSessionExpiresAt(sessionId: string, expiresAt: Date, db = this.drizzle.db) {
		db.update(sessionsTable).set({ expiresAt }).where(eq(sessionsTable.id, sessionId));
	}
}
