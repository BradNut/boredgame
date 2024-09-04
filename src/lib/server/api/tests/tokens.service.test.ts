import 'reflect-metadata';
import { container } from 'tsyringe';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { TokensService } from '../services/tokens.service';
import { HashingService } from '../services/hashing.service';
import { Argon2id } from 'oslo/password';

describe('TokensService', () => {
	let service: TokensService;
	const hashingService = vi.mocked(HashingService.prototype);

	beforeAll(() => {
		service = container
			.register<HashingService>(HashingService, { useValue: hashingService })
			.resolve(TokensService);
	});

	afterAll(() => {
		vi.resetAllMocks()
	});

	describe('Generate Token', () => {
		const hashedPassword = new Argon2id().hash('111');

		hashingService.hash = vi.fn().mockResolvedValue(hashedPassword);
		hashingService.verify = vi.fn().mockResolvedValue(true);

		const spy_hashingService_hash = vi.spyOn(hashingService, 'hash');
		const spy_hashingService_verify = vi.spyOn(hashingService, 'verify');

		it('should resolve', async () => {
			await expect(service.createHashedToken('111')).resolves.string
		})
		it('should generate a token that is verifiable', async () => {
			const token = await service.createHashedToken('111');
			expect(token).not.toBeUndefined();
			expect(token).not.toBeNull();
			const verifiable = await service.verifyHashedToken(token, '111');
			expect(verifiable).toBeTruthy();
		});

		it('should generate a hashed token', async () => {
			expect(spy_hashingService_hash).toHaveBeenCalledTimes(2);
		})
		it('should verify a hashed token', async () => {
			expect(spy_hashingService_verify).toHaveBeenCalledTimes(1);
		})
	});
});