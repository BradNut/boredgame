import { inject, injectable } from '@needle-di/core';
import { TimeSpan, type TimeSpanUnit, createDate } from 'oslo';
import { generateRandomString } from 'oslo/crypto';
import { HashingService } from '../common/services/hashing.service';

@injectable()
export class TokensService {
  constructor(private hashingService = inject(HashingService)) {}

  generateToken() {
    const alphabet = '23456789ACDEFGHJKLMNPQRSTUVWXYZ'; // alphabet with removed look-alike characters (0, 1, O, I)
    return generateRandomString(6, alphabet);
  }

  generateTokenWithExpiry(number: number, lifespan: TimeSpanUnit) {
    return {
      token: this.generateToken(),
      expiry: createDate(new TimeSpan(number, lifespan)),
    };
  }

  async generateTokenWithExpiryAndHash(number: number, lifespan: TimeSpanUnit) {
    const token = this.generateToken();
    const hashedToken = await this.hashingService.hash(token);
    return {
      token,
      hashedToken,
      expiry: createDate(new TimeSpan(number, lifespan)),
    };
  }

  async createHashedToken(token: string) {
    return this.hashingService.hash(token);
  }

  async verifyHashedToken(hashedToken: string, token: string) {
    return this.hashingService.verify(hashedToken, token);
  }
}
