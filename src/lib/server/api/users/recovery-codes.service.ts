import { RecoveryCodesRepository } from '$lib/server/api/users/recovery-codes.repository';
import { inject, injectable } from '@needle-di/core';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { HashingService } from '../common/services/hashing.service';

@injectable()
export class RecoveryCodesService {
  constructor(
    private hashingService = inject(HashingService),
    private recoveryCodesRepository = inject(RecoveryCodesRepository),
  ) {}

  async findAllRecoveryCodesByUserId(userId: string) {
    return this.recoveryCodesRepository.findAllByUserId(userId);
  }

  async createRecoveryCodes(userId: string) {
    const createdRecoveryCodes = Array.from({ length: 5 }, () => generateRandomString(10, alphabet('A-Z', '0-9')));
    if (createdRecoveryCodes && userId) {
      for (const code of createdRecoveryCodes) {
        const hashedCode = await this.hashingService.hash(code);
        console.log('Inserting recovery code', code, hashedCode);
        await this.recoveryCodesRepository.create({ userId, code: hashedCode });
      }

      return createdRecoveryCodes;
    }

    return [];
  }

  async verify(userId: string, code: string) {
    const recoveryCodes = await this.recoveryCodesRepository.findAllNotUsedByUserId(userId);
    return recoveryCodes.find((recoveryCode) => this.hashingService.verify(recoveryCode.code, code));
  }

  async deleteAllRecoveryCodesByUserId(userId: string) {
    return this.recoveryCodesRepository.deleteAllByUserId(userId);
  }
}
