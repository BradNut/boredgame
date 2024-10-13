import 'reflect-metadata';
import createApp from '$lib/server/api/common/create-app';
import configureOpenAPI from '$lib/server/api/configure-open-api';
import { CollectionController } from '$lib/server/api/controllers/collection.controller';
import { MfaController } from '$lib/server/api/controllers/mfa.controller';
import { OAuthController } from '$lib/server/api/controllers/oauth.controller';
import { SignupController } from '$lib/server/api/controllers/signup.controller';
import { UserController } from '$lib/server/api/controllers/user.controller';
import { WishlistController } from '$lib/server/api/controllers/wishlist.controller';
import { AuthCleanupJobs } from '$lib/server/api/jobs/auth-cleanup.job';
import { extendZodWithOpenApi } from 'hono-zod-openapi';
import { hc } from 'hono/client';
import { container } from 'tsyringe';
import { z } from 'zod';
import { config } from './common/config';
import { IamController } from './controllers/iam.controller';
import { LoginController } from './controllers/login.controller';

extendZodWithOpenApi(z);

export const app = createApp();

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
	.get('/', (c) => c.json({ message: 'Server is healthy' }));

configureOpenAPI(app);

/* -------------------------------------------------------------------------- */
/*                                  Cron Jobs                                 */
/* -------------------------------------------------------------------------- */
container.resolve(AuthCleanupJobs).deleteStaleEmailVerificationRequests();
container.resolve(AuthCleanupJobs).deleteStaleLoginRequests();

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export const rpc = hc<typeof routes>(config.api.origin);
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;
