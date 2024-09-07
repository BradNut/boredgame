import 'reflect-metadata'
import { Controller } from '$lib/server/api/common/types/controller'
import { UsersService } from '$lib/server/api/services/users.service'
import { inject, injectable } from 'tsyringe'
import { requireAuth } from '../middleware/auth.middleware'

@injectable()
export class UserController extends Controller {
	constructor(@inject(UsersService) private readonly usersService: UsersService) {
		super()
	}

	routes() {
		return this.controller
			.get('/', async (c) => {
				const user = c.var.user
				return c.json({ user })
			})
			.get('/:id', requireAuth, async (c) => {
				const id = c.req.param('id')
				const user = await this.usersService.findOneById(id)
				return c.json({ user })
			})
			.get('/username/:userName', requireAuth, async (c) => {
				const userName = c.req.param('userName')
				const user = await this.usersService.findOneByUsername(userName)
				return c.json({ user })
			})
	}
}
