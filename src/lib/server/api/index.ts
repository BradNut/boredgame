import 'reflect-metadata'
import { CollectionController } from '$lib/server/api/controllers/collection.controller'
import { MfaController } from '$lib/server/api/controllers/mfa.controller'
import { OAuthController } from '$lib/server/api/controllers/oauth.controller'
import { SignupController } from '$lib/server/api/controllers/signup.controller'
import { UserController } from '$lib/server/api/controllers/user.controller'
import { WishlistController } from '$lib/server/api/controllers/wishlist.controller'
import { AuthCleanupJobs } from '$lib/server/api/jobs/auth-cleanup.job'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'
import { hc } from 'hono/client'
import { cors } from 'hono/cors'
import { notFound, onError } from 'stoker/middlewares';
import { container } from 'tsyringe'
import { config } from './common/config'
import { IamController } from './controllers/iam.controller'
import { LoginController } from './controllers/login.controller'
import { validateAuthSession, verifyOrigin } from './middleware/auth.middleware'
import { pinoLogger } from './middleware/pino-logger.middleware'

type AppBindings = {
	Variables: {
		logger: PinoLogger
	}
}

/* -------------------------------------------------------------------------- */
/*                                     App                                    */
/* -------------------------------------------------------------------------- */
export const app = new OpenAPIHono<AppBindings>().basePath('/api')

/* -------------------------------------------------------------------------- */
/*                             Global Middlewares                             */
/* -------------------------------------------------------------------------- */
app.use(verifyOrigin).use(validateAuthSession)
app.use(pinoLogger())

app.notFound(notFound)
app.onError(onError)

app.use(
	'/*',
	cors({
		origin: ['http://localhost:5173', 'http://localhost:80', 'http://host.docker.internal:80', 'http://host.docker.internal:5173'], // Replace with your allowed domains

		allowMethods: ['POST'],
		allowHeaders: ['Content-Type'],
		// credentials: true, // If you need to send cookies or HTTP authentication
	}),
)

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const routes = app
	.route('/me', container.resolve(IamController).routes())
	.route('/user', container.resolve(UserController).routes())
	.route('/login', container.resolve(LoginController).routes())
	.route('/oauth', container.resolve(OAuthController).routes())
	.route('/signup', container.resolve(SignupController).routes())
	.route('/wishlists', container.resolve(WishlistController).routes())
	.route('/collections', container.resolve(CollectionController).routes())
	.route('/mfa', container.resolve(MfaController).routes())
	.get('/', (c) => c.json({ message: 'Server is healthy' }))
	.get('/error', (c) => {
		c.status(422);
		c.var.logger.info('Logged here');
		throw new Error('Test error')
	})

/* -------------------------------------------------------------------------- */
/*                                  Cron Jobs                                 */
/* -------------------------------------------------------------------------- */
container.resolve(AuthCleanupJobs).deleteStaleEmailVerificationRequests()
container.resolve(AuthCleanupJobs).deleteStaleLoginRequests()

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export const rpc = hc<typeof routes>(config.api.origin)
export type ApiClient = typeof rpc
export type ApiRoutes = typeof routes
