import { github } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { lucia } from "$lib/server/lucia";
import type { RequestEvent } from "@sveltejs/kit";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { inject, injectable } from "tsyringe";
import { UsersService } from "./users.service";
import { FederatedIdentityRepository } from "../repositories/federated_identity.repository";

@inejectable()
export class OAuthService {
	constructor(
		@inject(FederatedIdentityRepository) private readonly federatedIdentityRepository: FederatedIdentityRepository,
		@inject(UsersService) private readonly usersService: UsersService
	) {}

	async handleOAuthUser(oauthUserId: number, oauthUsername: string, oauthProvider: string) {
		const existingUser = await this.federatedIdentityRepository.findOneByUserIdAndProvider(`${oauthUserId}`, oauthProvider)

		if (existingUser) {
			return existingUser.id
		} else {
			const userId = generateIdFromEntropySize(10); // 16 characters long

			const user = await this.drizzleService.db.transaction(async (trx) => {
				const user = await this.usersService.create({
					id: userId,
					username: oauthUsername
				}, trx);

				await this.federatedIdentityRepository.create({
					identity_provider: oauthProvider,
					user_id: userId,
					identity_id: `${oauthUserId}`
				}, trx);
				return user;
			})

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}
}