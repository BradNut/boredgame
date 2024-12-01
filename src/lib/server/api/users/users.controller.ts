import { requireFullAuth, requireTempAuth } from '$lib/server/api/common/middleware/require-auth.middleware';
import { Controller } from '$lib/server/api/common/types/controller';
import { UsersService } from '$lib/server/api/users/users.service';
import { inject, injectable } from '@needle-di/core';
import { authState } from '../common/middleware/auth.middleware';
import { zValidator } from '@hono/zod-validator';
import { updateProfileDto } from '../dtos/update-profile.dto';

@injectable()
export class UsersController extends Controller {
  constructor(private usersService = inject(UsersService)) {
    super();
  }

  routes() {
    return this.controller
      .get('/me', async (c) => {
        const session = c.var.session;
        const user = session ? await this.usersService.findOneById(session.userId) : null;
        return c.json({ user, session });
      })
      .patch('/me', authState('session'), zValidator('json', updateProfileDto), async (c) => {
        await this.usersService.updateUser(c.var.session.userId, c.req.valid('json'));
        const user = await this.usersService.findOneById(c.var.session.userId);
        return c.json(user);
      })
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
