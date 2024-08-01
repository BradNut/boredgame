import { inject, injectable } from 'tsyringe';
import type { UsersRepository } from '../repositories/users.repository';

@injectable()
export class UsersService {
	constructor(
		@inject('UsersRepository') private readonly usersRepository: UsersRepository
	) { }

	async findOneByUsername(username: string) {
		return this.usersRepository.findOneByUsername(username);
	}

	async findOneById(id: string) {
		return this.usersRepository.findOneById(id);
	}
}