import { CredentialsRepository } from '$lib/server/api/repositories/credentials.repository'
import { decodeHex, encodeHexLowerCase } from '@oslojs/encoding'
import { verifyTOTP } from '@oslojs/otp'
import { inject, injectable } from 'tsyringe'
import type { CredentialsType } from '../databases/tables'

@injectable()
export class TotpService {
	constructor(@inject(CredentialsRepository) private readonly credentialsRepository: CredentialsRepository) {}

	async findOneByUserId(userId: string) {
		return this.credentialsRepository.findTOTPCredentialsByUserId(userId)
	}

	async findOneByUserIdOrThrow(userId: string) {
		const credential = await this.findOneByUserId(userId)
		if (!credential) {
			throw new Error('TOTP credential not found')
		}
		return credential
	}

	async create(userId: string) {
		const secret = new Uint8Array(20)
		try {
			return await this.credentialsRepository.create({
				user_id: userId,
				secret_data: encodeHexLowerCase(crypto.getRandomValues(secret)),
				type: 'totp',
			})
		} catch (e) {
			console.error(e)
			return null
		}
	}

	async deleteOneByUserId(userId: string) {
		return this.credentialsRepository.deleteByUserId(userId)
	}

	async deleteOneByUserIdAndType(userId: string, type: CredentialsType) {
		return this.credentialsRepository.deleteByUserIdAndType(userId, type)
	}

	async verify(userId: string, code: string) {
		const credential = await this.credentialsRepository.findTOTPCredentialsByUserId(userId)
		if (!credential) {
			throw new Error('TOTP credential not found')
		}
		return await verifyTOTP(decodeHex(credential.secret_data), 30, 6, code)
	}
}
