import { Hono } from 'hono';
import { hc } from 'hono/client';
import { validateAuthSession, verifyOrigin } from './middleware/auth.middleware';
import users from './controllers/iam.controller';
import { config } from './common/config';

/* ----------------------------------- Api ---------------------------------- */
const app = new Hono().basePath('/api');

/* --------------------------- Global Middlewares --------------------------- */
app.use(verifyOrigin).use(validateAuthSession);

/* --------------------------------- Routes --------------------------------- */
const routes = app
	.route('/iam', users)

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export const rpc = hc<typeof routes>(config.ORIGIN);
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;
export { app };