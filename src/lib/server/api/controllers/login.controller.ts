import 'reflect-metadata';
import {Controller} from '$lib/server/api/common/types/controller';
import {cookieExpiresAt, createSessionTokenCookie, setSessionCookie} from '$lib/server/api/common/utils/cookies';
import {signinUsernameDto} from '$lib/server/api/dtos/signin-username.dto';
import {SessionsService} from '$lib/server/api/services/sessions.service';
import {zValidator} from '@hono/zod-validator';
import {openApi} from 'hono-zod-openapi';
import {inject, injectable} from 'tsyringe';
import {limiter} from '../middleware/rate-limiter.middleware';
import {LoginRequestsService} from '../services/loginrequest.service';
import {signinUsername} from './login.routes';

@injectable()
export class LoginController extends Controller {
	constructor(
		@inject(LoginRequestsService) private readonly loginRequestsService: LoginRequestsService,
		@inject(SessionsService) private luciaService: SessionsService,
	) {
		super();
	}

	routes() {
		return this.controller.post(
			'/',
			openApi(signinUsername),
			zValidator('json', signinUsernameDto),
			limiter({ limit: 10, minutes: 60 }),
			async (c) => {
				const { username, password } = c.req.valid('json');
				const session = await this.loginRequestsService.verify({ username, password }, c.req);
				const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
				console.log('set cookie', sessionCookie);
				setSessionCookie(c, sessionCookie);
				return c.json({ message: 'ok' });
			},
		);
	}
}
