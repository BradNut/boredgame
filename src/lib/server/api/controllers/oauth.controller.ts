import 'reflect-metadata';
import { Controller } from '$lib/server/api/common/types/controller';
import type { OAuthUser } from '$lib/server/api/common/types/oauth';
import { cookieExpiresAt, createSessionTokenCookie, setSessionCookie } from '$lib/server/api/common/utils/cookies';
import { OAuthService } from '$lib/server/api/services/oauth.service';
import { SessionsService } from '$lib/server/api/services/sessions.service';
import { github, google } from '$lib/server/auth';
import { OAuth2RequestError } from 'arctic';
import { getCookie, setCookie } from 'hono/cookie';
import { TimeSpan } from 'oslo';

import { inject, injectable } from 'tsyringe';

@injectable()
export class OAuthController extends Controller {
	constructor(
		@inject(SessionsService) private sessionsService: SessionsService,
		@inject(OAuthService) private oauthService: OAuthService,
	) {
		super();
	}

	routes() {
		return this.controller
			.get('/github', async (c) => {
				try {
					const code = c.req.query('code')?.toString() ?? null;
					const state = c.req.query('state')?.toString() ?? null;
					const storedState = getCookie(c).github_oauth_state ?? null;

					if (!code || !state || !storedState || state !== storedState) {
						return c.body(null, 400);
					}

					const tokens = await github.validateAuthorizationCode(code);
					const githubUserResponse = await fetch('https://api.github.com/user', {
						headers: {
							Authorization: `Bearer ${tokens.accessToken}`,
						},
					});
					const githubUser: GitHubUser = await githubUserResponse.json();

					const oAuthUser: OAuthUser = {
						sub: `${githubUser.id}`,
						username: githubUser.login,
						email: undefined,
					};

					const userId = await this.oauthService.handleOAuthUser(oAuthUser, 'github');

					const sessionToken = this.sessionsService.generateSessionToken();
					const session = await this.sessionsService.createSession(sessionToken, userId, '', '', false, false);
					const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
					setSessionCookie(c, sessionCookie);
					return c.json({ message: 'ok' });
				} catch (error) {
					console.error(error);
					// the specific error message depends on the provider
					if (error instanceof OAuth2RequestError) {
						// invalid code
						return c.body(null, 400);
					}
					return c.body(null, 500);
				}
			})
			.get('/google', async (c) => {
				try {
					const code = c.req.query('code')?.toString() ?? null;
					const state = c.req.query('state')?.toString() ?? null;
					const storedState = getCookie(c).google_oauth_state ?? null;
					const storedCodeVerifier = getCookie(c).google_oauth_code_verifier ?? null;

					if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
						return c.body(null, 400);
					}

					const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
					const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
						headers: {
							Authorization: `Bearer ${tokens.accessToken}`,
						},
					});
					const googleUser: GoogleUser = await googleUserResponse.json();

					const oAuthUser: OAuthUser = {
						sub: googleUser.sub,
						given_name: googleUser.given_name,
						family_name: googleUser.family_name,
						picture: googleUser.picture,
						username: googleUser.email,
						email: googleUser.email,
						email_verified: googleUser.email_verified,
					};

					const userId = await this.oauthService.handleOAuthUser(oAuthUser, 'google');
					const sessionToken = this.sessionsService.generateSessionToken();
					const session = await this.sessionsService.createSession(sessionToken, userId, '', '', false, false);
					const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
					setSessionCookie(c, sessionCookie);

					return c.json({ message: 'ok' });
				} catch (error) {
					console.error(error);
					// the specific error message depends on the provider
					if (error instanceof OAuth2RequestError) {
						// invalid code
						return c.body(null, 400);
					}
					return c.body(null, 500);
				}
			});
	}
}

interface GitHubUser {
	id: number;
	login: string;
}

interface GoogleUser {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
}
