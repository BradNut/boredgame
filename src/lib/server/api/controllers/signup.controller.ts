import 'reflect-metadata'
import { Controller } from '$lib/server/api/common/types/controller'
import { signupUsernameEmailDto } from '$lib/server/api/dtos/signup-username-email.dto'
import { limiter } from '$lib/server/api/middleware/rate-limiter.middleware'
import { LoginRequestsService } from '$lib/server/api/services/loginrequest.service'
import { LuciaService } from '$lib/server/api/services/lucia.service'
import { UsersService } from '$lib/server/api/services/users.service'
import { zValidator } from '@hono/zod-validator'
import { setCookie } from 'hono/cookie'
import { TimeSpan } from 'oslo'
import { inject, injectable } from 'tsyringe'

@injectable()
export class SignupController extends Controller {
	constructor(
		@inject(UsersService) private readonly usersService: UsersService,
		@inject(LoginRequestsService) private readonly loginRequestService: LoginRequestsService,
		@inject(LuciaService) private luciaService: LuciaService,
	) {
		super()
	}

	routes() {
		return this.controller.post('/', zValidator('json', signupUsernameEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
			const { firstName, lastName, email, username, password, confirm_password } = await c.req.valid('json')
			const existingUser = await this.usersService.findOneByUsername(username)

			if (existingUser) {
				return c.body('User already exists', 400)
			}

			const user = await this.usersService.create({ firstName, lastName, email, username, password, confirm_password })

			if (!user) {
				return c.body('Failed to create user', 500)
			}

			const session = await this.loginRequestService.createUserSession(user.id, c.req, undefined)
			const sessionCookie = this.luciaService.lucia.createSessionCookie(session.id)
			console.log('set cookie', sessionCookie)
			setCookie(c, sessionCookie.name, sessionCookie.value, {
				path: sessionCookie.attributes.path,
				maxAge:
					sessionCookie?.attributes?.maxAge && sessionCookie?.attributes?.maxAge < new TimeSpan(365, 'd').seconds()
						? sessionCookie.attributes.maxAge
						: new TimeSpan(2, 'w').seconds(),
				domain: sessionCookie.attributes.domain,
				sameSite: sessionCookie.attributes.sameSite as any,
				secure: sessionCookie.attributes.secure,
				httpOnly: sessionCookie.attributes.httpOnly,
				expires: sessionCookie.attributes.expires,
			})
			return c.json({ message: 'ok' })
		})
	}
}
