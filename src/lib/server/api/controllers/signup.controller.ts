import 'reflect-metadata';
import {Controller} from '$lib/server/api/common/types/controller';
import {signupUsernameEmailDto} from '$lib/server/api/dtos/signup-username-email.dto';
import {limiter} from '$lib/server/api/middleware/rate-limiter.middleware';
import {LoginRequestsService} from '$lib/server/api/services/loginrequest.service';
import {SessionsService} from '$lib/server/api/services/sessions.service';
import {UsersService} from '$lib/server/api/services/users.service';
import {zValidator} from '@hono/zod-validator';
import {inject, injectable} from '@needle-di/core';
import {cookieExpiresAt, createSessionTokenCookie, setSessionCookie} from "$lib/server/api/common/utils/cookies";

@injectable()
export class SignupController extends Controller {
	constructor(
		private usersService = inject(UsersService),
		private loginRequestService = inject(LoginRequestsService),
		private sessionsService = inject(SessionsService),
	) {
		super();
	}

	routes() {
		return this.controller.post('/', zValidator('json', signupUsernameEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
			const { firstName, lastName, email, username, password, confirm_password } = await c.req.valid('json');
			const existingUser = await this.usersService.findOneByUsername(username);

			if (existingUser) {
				return c.body('User already exists', 400);
			}

			const user = await this.usersService.create({ firstName, lastName, email, username, password, confirm_password });

			if (!user) {
				return c.body('Failed to create user', 500);
			}

			const session = await this.loginRequestService.createUserSession(user.id, c.req, false, false);
			const sessionCookie = createSessionTokenCookie(session.id, cookieExpiresAt);
			console.log('set cookie', sessionCookie);
			setSessionCookie(c, sessionCookie);
			return c.json({ message: 'ok' });
		});
	}
}
