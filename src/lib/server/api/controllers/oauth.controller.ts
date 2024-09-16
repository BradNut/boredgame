import 'reflect-metadata'
import { Controller } from '$lib/server/api/common/types/controller'
import { LuciaService } from '$lib/server/api/services/lucia.service'
import { OAuthService } from '$lib/server/api/services/oauth.service'
import { github } from '$lib/server/auth'
import { OAuth2RequestError } from 'arctic'
import { getCookie } from 'hono/cookie'
import { inject, injectable } from 'tsyringe'

@injectable()
export class OAuthController extends Controller {
	constructor(
		@inject(LuciaService) private luciaService: LuciaService,
		@inject(OAuthService) private readonly oauthService: OAuthService) {
		super()
	}

	routes() {
		return this.controller
			.get('/github', async (c) => {
				try {
					const code = c.req.query('code')?.toString() ?? null
					const state = c.req.query('state')?.toString() ?? null
					const storedState = getCookie(c).github_oauth_state ?? null

					if (!code || !state || !storedState || state !== storedState) {
						return c.body(null, 400)
					}

					const tokens = await github.validateAuthorizationCode(code)
					const githubUserResponse = await fetch("https://api.github.com/user", {
						headers: {
						  Authorization: `Bearer ${tokens.accessToken}`
						}
					});
					const githubUser: GitHubUser = await githubUserResponse.json();

					const token = await this.oauthService.handleOAuthUser(githubUser.id, githubUser.login, 'github')
					return c.json({ token })
				} catch (error) {
					// the specific error message depends on the provider
					if (error instanceof OAuth2RequestError) {
						// invalid code
						return c.body(null, 400)
					}
					return c.body(null, 500)
				}
			})
	}
}

interface GitHubUser {
	id: number;
	login: string;
}