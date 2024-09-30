import 'reflect-metadata'
import { container } from 'tsyringe'
import { afterAll, beforeAll, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { HashingService } from '../services/hashing.service'
import { TokensService } from '../services/tokens.service'

describe('TokensService', () => {
	let service: TokensService
	const hashingService = vi.mocked(HashingService.prototype)

	beforeAll(() => {
		service = container.register<HashingService>(HashingService, { useValue: hashingService }).resolve(TokensService)
	})

	afterAll(() => {
		vi.resetAllMocks()
	})

	describe('Generate Token', () => {
		it('should resolve', async () => {
			const hashedPassword = 'testhash'
			hashingService.hash = vi.fn().mockResolvedValue(hashedPassword)
			const spy_hashingService_hash = vi.spyOn(hashingService, 'hash')
			const spy_hashingService_verify = vi.spyOn(hashingService, 'verify')
			await expectTypeOf(service.createHashedToken('111')).resolves.toBeString()
			expect(spy_hashingService_hash).toBeCalledTimes(1)
			expect(spy_hashingService_verify).toBeCalledTimes(0)
		})
		it('should generate a token that is verifiable', async () => {
			hashingService.hash = vi.fn().mockResolvedValue('testhash')
			hashingService.verify = vi.fn().mockResolvedValue(true)
			const spy_hashingService_hash = vi.spyOn(hashingService, 'hash')
			const spy_hashingService_verify = vi.spyOn(hashingService, 'verify')
			const token = await service.createHashedToken('111')
			expect(token).not.toBeNaN()
			expect(token).not.toBeUndefined()
			expect(token).not.toBeNull()
			const verifiable = await service.verifyHashedToken(token, '111')
			expect(verifiable).toBeTruthy()
			expect(spy_hashingService_hash).toBeCalledTimes(1)
			expect(spy_hashingService_verify).toBeCalledTimes(1)
		})
	})
})
