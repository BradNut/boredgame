import createApp from "$lib/server/api/common/create-app";
import configureOpenAPI from "$lib/server/api/configure-open-api";
import { CollectionController } from "$lib/server/api/controllers/collection.controller";
import { MfaController } from "$lib/server/api/controllers/mfa.controller";
import { OAuthController } from "$lib/server/api/controllers/oauth.controller";
import { SignupController } from "$lib/server/api/controllers/signup.controller";
import { UserController } from "$lib/server/api/controllers/user.controller";
import { WishlistController } from "$lib/server/api/controllers/wishlist.controller";
import { AuthCleanupJobs } from "$lib/server/api/jobs/auth-cleanup.job";
import { Container } from "@needle-di/core";
import { extendZodWithOpenApi } from "hono-zod-openapi";
import { hc } from "hono/client";
import { z } from "zod";
import { config } from "./common/config";
import { IamController } from "./controllers/iam.controller";
import { LoginController } from "./controllers/login.controller";

extendZodWithOpenApi(z);

const container = new Container();

export const app = createApp();

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const routes = app
	.route("/me", container.get(IamController).routes())
	.route("/user", container.get(UserController).routes())
	.route("/login", container.get(LoginController).routes())
	.route("/oauth", container.get(OAuthController).routes())
	.route("/signup", container.get(SignupController).routes())
	.route("/wishlists", container.get(WishlistController).routes())
	.route("/collections", container.get(CollectionController).routes())
	.route("/mfa", container.get(MfaController).routes())
	.get("/", (c) => c.json({ message: "Server is healthy" }));

configureOpenAPI(app);

/* -------------------------------------------------------------------------- */
/*                                  Cron Jobs                                 */
/* -------------------------------------------------------------------------- */
container.get(AuthCleanupJobs).deleteStaleEmailVerificationRequests();
container.get(AuthCleanupJobs).deleteStaleLoginRequests();

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export const rpc = hc<typeof routes>(config.api.origin);
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;
