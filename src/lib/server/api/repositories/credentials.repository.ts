import type { Repository } from '$lib/server/api/common/interfaces/repository.interface'
import { CredentialsType, credentialsTable } from '$lib/server/api/databases/tables/credentials.table'
import { DatabaseProvider } from '$lib/server/api/providers/database.provider'
import { type InferInsertModel, and, eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { takeFirstOrThrow } from '../common/utils/repository.utils'

export type CreateCredentials = InferInsertModel<typeof credentialsTable>
export type UpdateCredentials = Partial<CreateCredentials>

@injectable()
export class CredentialsRepository implements Repository {
	constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) {}

	async findOneByUserId(userId: string) {
		return this.db.query.credentialsTable.findFirst({
			where: eq(credentialsTable.user_id, userId),
		})
	}

	async findOneByUserIdAndType(userId: string, type: CredentialsType) {
		return this.db.query.credentialsTable.findFirst({
			where: and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, type)),
		})
	}

	async findPasswordCredentialsByUserId(userId: string) {
		return this.db.query.credentialsTable.findFirst({
			where: and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, CredentialsType.PASSWORD)),
		})
	}

	async findTOTPCredentialsByUserId(userId: string) {
		return this.db.query.credentialsTable.findFirst({
			where: and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, CredentialsType.TOTP)),
		})
	}

	async findOneById(id: string) {
		return this.db.query.credentialsTable.findFirst({
			where: eq(credentialsTable.id, id),
		})
	}

	async findOneByIdOrThrow(id: string) {
		const credentials = await this.findOneById(id)
		if (!credentials) throw Error('Credentials not found')
		return credentials
	}

	async create(data: CreateCredentials) {
		return this.db.insert(credentialsTable).values(data).returning().then(takeFirstOrThrow)
	}

	async update(id: string, data: UpdateCredentials) {
		return this.db.update(credentialsTable).set(data).where(eq(credentialsTable.id, id)).returning().then(takeFirstOrThrow)
	}

	async delete(id: string) {
		return this.db.delete(credentialsTable).where(eq(credentialsTable.id, id))
	}

	async deleteByUserId(userId: string) {
		return this.db.delete(credentialsTable).where(eq(credentialsTable.user_id, userId))
	}

	async deleteByUserIdAndType(userId: string, type: CredentialsType) {
		return this.db.delete(credentialsTable).where(and(eq(credentialsTable.user_id, userId), eq(credentialsTable.type, type)))
	}

	trxHost(trx: DatabaseProvider) {
		return new CredentialsRepository(trx)
	}
}
