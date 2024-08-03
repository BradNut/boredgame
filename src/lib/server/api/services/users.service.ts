// import { inject, injectable } from 'tsyringe';
// import type { UsersRepository } from '../repositories/users.repository';

import { usersRepository } from "../repositories/users.repository";

// @injectable()
export class UsersService {
	// constructor(
	// 	@inject('UsersRepository') private readonly usersRepository: UsersRepository
	// ) { }

	async findOneByUsername(username: string) {
		return usersRepository.findOneByUsername(username);
	}

	async findOneById(id: string) {
		return usersRepository.findOneById(id);
	}
}