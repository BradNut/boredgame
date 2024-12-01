import { inject, injectable } from '@needle-di/core';
import { decodeBase64, encodeBase64 } from '@oslojs/encoding';
import { generateTOTP, verifyTOTP } from '@oslojs/otp';
import { EncryptionService } from '../common/services/encryption.service';
import type { CredentialsType } from '../databases/postgres/tables';
import { CredentialsRepository } from '../users/credentials.repository';

@injectable()
export class TotpService {
  constructor(
    private credentialsRepository = inject(CredentialsRepository),
    private encryptionService = inject(EncryptionService),
  ) {}

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

  async create(userId: string, key: Uint8Array) {
    try {
      return await this.credentialsRepository.create({
        user_id: userId,
        secret_data: encodeBase64(this.encryptionService.encrypt(key)),
        type: 'totp',
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
    return this.credentialsRepository.deleteByUserIdAndType(userId, type);
  }

  async verify(userId: string, code: string) {
    const credential = await this.credentialsRepository.findTOTPCredentialsByUserId(userId);
    console.log(`TOTP credential: ${JSON.stringify(credential)}`);
    if (!credential) {
      throw new Error('TOTP credential not found');
    }
    const secret = this.encryptionService.decrypt(decodeBase64(credential.secret_data));
    return verifyTOTP(secret, 30, 6, code);
  }
}
