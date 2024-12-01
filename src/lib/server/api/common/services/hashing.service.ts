import { injectable } from '@needle-di/core';
import { hash, verify } from 'argon2';

@injectable()
export class HashingService {
  hash(data: string): Promise<string> {
    return hash(data);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return verify(encrypted, data);
  }
}
