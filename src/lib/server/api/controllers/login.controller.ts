import 'reflect-metadata'
import { Controller } from '$lib/server/api/common/types/controller'
import { signinUsernameDto } from '$lib/server/api/dtos/signin-username.dto'
import { LuciaService } from '$lib/server/api/services/lucia.service'
import { zValidator } from '@hono/zod-validator'
import { setCookie } from 'hono/cookie'
import { TimeSpan } from 'oslo'
import { openApi } from 'hono-zod-openapi';
import { inject, injectable } from 'tsyringe'
import { limiter } from '../middleware/rate-limiter.middleware'
import { LoginRequestsService } from '../services/loginrequest.service'
import { signinUsername } from './login.routes'

@injectable()
export class LoginController extends Controller {
	constructor(
		@inject(LoginRequestsService) private readonly loginRequestsService: LoginRequestsService,
		@inject(LuciaService) private luciaService: LuciaService,
	) {
		super()
	}

	routes() {
		return this.controller.post('/', openApi(signinUsername), zValidator('json', signinUsernameDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
			const { username, password } = c.req.valid('json')
			const session = await this.loginRequestsService.verify({ username, password }, c.req)
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
