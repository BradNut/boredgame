// import { inject, injectable } from "tsyringe";
import { generateRandomString } from "oslo/crypto";
import { TimeSpan, createDate, type TimeSpanUnit } from 'oslo';
import { hashingService } from "./hashing.service";

// @injectable()
class TokensService {
	// constructor(@inject(HashingService) private readonly hashingService: HashingService) { }

	generateToken() {
		const alphabet = '23456789ACDEFGHJKLMNPQRSTUVWXYZ'; // alphabet with removed look-alike characters (0, 1, O, I)
		return generateRandomString(6, alphabet);
	}

	generateTokenWithExpiry(number: number, lifespan: TimeSpanUnit) {
		return {
			token: this.generateToken(),
			expiry: createDate(new TimeSpan(number, lifespan))
		}
	}

	async generateTokenWithExpiryAndHash(number: number, lifespan: TimeSpanUnit) {
		const token = this.generateToken()
		const hashedToken = await hashingService.hash(token)
		return {
			token,
			hashedToken,
			expiry: createDate(new TimeSpan(number, lifespan))
		}
	}

	async verifyHashedToken(hashedToken: string, token: string) {
		return hashingService.verify(hashedToken, token)
	}
}

export const tokensService = new TokensService()