import 'reflect-metadata';
import { Container } from '@needle-di/core';
import { afterAll, beforeAll, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { HashingService } from '../common/services/hashing.service';
import { TokensService } from '../services/tokens.service';

describe('TokensService', () => {
  const container = new Container();
  let service: TokensService;
  const hashingService = vi.mocked(HashingService.prototype);

  beforeAll(() => {
    container.bind<HashingService>({ provide: HashingService, useValue: hashingService });
    service = container.get(TokensService);
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('Generate Token', () => {
    it('should resolve', async () => {
      const hashedPassword = 'testhash';
      hashingService.hash = vi.fn().mockResolvedValue(hashedPassword);
      const spy_hashingService_hash = vi.spyOn(hashingService, 'hash');
      const spy_hashingService_verify = vi.spyOn(hashingService, 'verify');
      await expectTypeOf(service.createHashedToken('111')).resolves.toBeString();
      expect(spy_hashingService_hash).toBeCalledTimes(1);
      expect(spy_hashingService_verify).toBeCalledTimes(0);
    });
    it('should generate a token that is verifiable', async () => {
      hashingService.hash = vi.fn().mockResolvedValue('testhash');
      hashingService.verify = vi.fn().mockResolvedValue(true);
      const spy_hashingService_hash = vi.spyOn(hashingService, 'hash');
      const spy_hashingService_verify = vi.spyOn(hashingService, 'verify');
      const token = await service.createHashedToken('111');
      expect(token).not.toBeNaN();
      expect(token).not.toBeUndefined();
      expect(token).not.toBeNull();
      const verifiable = await service.verifyHashedToken(token, '111');
      expect(verifiable).toBeTruthy();
      expect(spy_hashingService_hash).toBeCalledTimes(1);
      expect(spy_hashingService_verify).toBeCalledTimes(1);
    });
  });
});
