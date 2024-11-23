import { Controller } from '$lib/server/api/common/types/controller';
import { UsersService } from '$lib/server/api/services/users.service';
import { inject, injectable } from '@needle-di/core';
import { requireFullAuth, requireTempAuth } from '../middleware/require-auth.middleware';

@injectable()
export class UserController extends Controller {
  constructor(private usersService = inject(UsersService)) {
    super();
  }

  routes() {
    return this.controller
      .get('/', requireTempAuth, async (c) => {
        const session = c.var.session;
        const user = session ? await this.usersService.findOneById(session.userId) : null;
        return c.json({ user, session });
      })
      .get('/:id', requireFullAuth, async (c) => {
        const id = c.req.param('id');
        const user = await this.usersService.findOneById(id);
        return c.json({ user });
      })
      .get('/username/:userName', requireFullAuth, async (c) => {
        const userName = c.req.param('userName');
        const user = await this.usersService.findOneByUsername(userName);
        return c.json({ user });
      });
  }
}
