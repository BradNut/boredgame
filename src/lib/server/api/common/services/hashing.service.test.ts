import { Container } from '@needle-di/core';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;
  const container = new Container();

  beforeAll(() => {
    service = container.get(HashingService);
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('Create Hash', () => {
    it('should create a hash', async () => {
      const hash = await service.hash('111');
      expect(hash).not.toBeUndefined();
      expect(hash).not.toBeNull();
    });
  });

  describe('Verify Hash', () => {
    it('should verify a hash', async () => {
      const hash = await service.hash('111');
      const verifiable = await service.verify(hash, '111');
      expect(verifiable).toBeTruthy();
    });

    it('should not verify a hash', async () => {
      const hash = await service.hash('111');
      const verifiable = await service.verify(hash, '222');
      expect(verifiable).toBeFalsy();
    });
  });
});
