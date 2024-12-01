import { CollectionController } from '$lib/server/api/collections/collection.controller';
import { LoginController } from '$lib/server/api/login/login.controller';
import { MfaController } from '$lib/server/api/mfa/mfa.controller';
import { OAuthController } from '$lib/server/api/oauth/oauth.controller';
import { SignupController } from '$lib/server/api/signup/signup.controller';
import { WishlistController } from '$lib/server/api/wishlists/wishlist.controller';
import { inject, injectable } from '@needle-di/core';
import { contextStorage } from 'hono/context-storage';
import { requestId } from 'hono/request-id';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { RootController } from './common/factories/controllers.factory';
import { browserSessions } from './common/middleware/browser-session.middleware';
import { pinoLogger } from './common/middleware/pino-logger.middleware';
import { rateLimit } from './common/middleware/rate-limit.middleware';
import { sessionManagement } from './common/middleware/session-management.middleware';
import { generateId } from './common/utils/crypto';
import configureOpenAPI from './configure-open-api';
import { IamController } from './iam/iam.controller';
import { UsersController } from './users/users.controller';

@injectable()
export class ApplicationController extends RootController {
  constructor(
    private loginController = inject(LoginController),
    private oAuthController = inject(OAuthController),
    private signupController = inject(SignupController),
    private mfaController = inject(MfaController),
    private iamController = inject(IamController),
    private usersController = inject(UsersController),
    private wishlistController = inject(WishlistController),
    private collectionController = inject(CollectionController),
  ) {
    super();
  }

  routes() {
    return this.controller
      .get('/', (c) => {
        return c.json({ status: 'ok' });
      })
      .get('/healthz', (c) => {
        return c.json({ message: 'Server is healthy' });
      })
      .get('/rate-limit', rateLimit({ limit: 3, minutes: 1 }), (c) => {
        return c.json({ message: 'Test!' });
      });
  }

  registerControllers() {
    const app = this.controller;
    app.onError(onError);
    app.notFound(notFound);
    app
      .basePath('/api')
      .use(requestId({ generator: () => generateId() }))
      .use(contextStorage())
      .use(browserSessions)
      .use(sessionManagement)
      .use(serveEmojiFavicon('📝'))
      .use(pinoLogger())
      .route('/', this.routes())
      .route('/iam', this.iamController.routes())
      .route('/users', this.usersController.routes())
      .route('/login', this.loginController.routes())
      .route('/oauth', this.oAuthController.routes())
      .route('/signup', this.signupController.routes())
      .route('/wishlists', this.wishlistController.routes())
      .route('/collections', this.collectionController.routes())
      .route('/mfa', this.mfaController.routes());

    configureOpenAPI(app);
    return app;
  }
}
