import { inject, injectable } from "tsyringe";
import { HMAC } from 'oslo/crypto';
import { decodeHex, encodeHex } from 'oslo/encoding';
import {CredentialsRepository} from "$lib/server/api/repositories/credentials.repository";
import { TOTPController } from "oslo/otp";
import type { CredentialsType } from "$db/tables";

@injectable()
export class TotpService {

	constructor(
			@inject(CredentialsRepository) private readonly credentialsRepository: CredentialsRepository
	) {
	}

	async findOneByUserId(userId: string) {
		return this.credentialsRepository.findTOTPCredentialsByUserId(userId);
	}

	async findOneByUserIdOrThrow(userId: string) {
		const credential = await this.findOneByUserId(userId);
		if (!credential) {
			throw new Error('TOTP credential not found');
		}
		return credential;
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

	async deleteOneByUserIdAndType(userId: string, type: CredentialsType) {
		return this.credentialsRepository.deleteByUserIdAndType(userId, type)
	}

	async verify(userId: string, code: string) {
		const credential = await this.credentialsRepository.findTOTPCredentialsByUserId(userId);
		if (!credential) {
			throw new Error('TOTP credential not found');
		}
		return await new TOTPController().verify(code, decodeHex(credential.secret_data))
	}
}