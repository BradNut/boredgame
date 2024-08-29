import { inject, injectable } from "tsyringe";
import { HMAC } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import {CredentialsRepository} from "$lib/server/api/repositories/credentials.repository";

@injectable()
export class TotpService {

	constructor(
			@inject(CredentialsRepository) private readonly credentialsRepository: CredentialsRepository
	) {
	}

	async findOneByUserId(userId: string) {
		return this.credentialsRepository.findTOTPCredentialsByUserId(userId);
	}

	async create(userId: string) {
		const twoFactorSecret = await new HMAC('SHA-1').generateKey();

		try {
			return await this.credentialsRepository.create({
				user_id: userId,
				secret_data: encodeHex(twoFactorSecret),
				type: 'totp'
			});
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	async deleteOneByUserId(userId: string) {
		return this.credentialsRepository.deleteByUserId(userId);
	}
}