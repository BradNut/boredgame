import 'reflect-metadata'
import { RecoveryCodesRepository } from '$lib/server/api/repositories/recovery-codes.repository'
import { alphabet, generateRandomString } from 'oslo/crypto'
import { Argon2id } from 'oslo/password'
import { inject, injectable } from 'tsyringe'

@injectable()
export class RecoveryCodesService {
	constructor(@inject(RecoveryCodesRepository) private readonly recoveryCodesRepository: RecoveryCodesRepository) {}

	async findAllRecoveryCodesByUserId(userId: string) {
		return this.recoveryCodesRepository.findAllByUserId(userId)
	}

	async createRecoveryCodes(userId: string) {
		const createdRecoveryCodes = Array.from({ length: 5 }, () => generateRandomString(10, alphabet('A-Z', '0-9')))
		if (createdRecoveryCodes && userId) {
			for (const code of createdRecoveryCodes) {
				const hashedCode = await new Argon2id().hash(code)
				console.log('Inserting recovery code', code, hashedCode)
				await this.recoveryCodesRepository.create({ userId, code: hashedCode })
			}

			return createdRecoveryCodes
		}

		return []
	}

	async deleteAllRecoveryCodesByUserId(userId: string) {
		return this.recoveryCodesRepository.deleteAllByUserId(userId)
	}
}
