import { inject, injectable } from 'tsyringe';
import { UsersRepository } from '../repositories/users.repository';
import type {SignupUsernameEmailDto} from "$lib/dtos/signup-username-email.dto";
import {TokensService} from "$lib/server/api/services/tokens.service";
import {CredentialsRepository} from "$lib/server/api/repositories/credentials.repository";
import {CredentialsType} from "$lib/server/api/infrastructure/database/tables";
import {UserRolesService} from "$lib/server/api/services/user_roles.service";

@injectable()
export class UsersService {
	constructor(
		@inject(CredentialsRepository) private readonly credentialsRepository: CredentialsRepository,
		@inject(TokensService) private readonly tokenService: TokensService,
		@inject(UsersRepository) private readonly usersRepository: UsersRepository,
		@inject(UserRolesService) private readonly userRolesService: UserRolesService,
	) { }

	async create(data: SignupUsernameEmailDto) {
		const { firstName, lastName, email, username, password } = data;

		const hashedPassword = await this.tokenService.createHashedToken(password);
		const user = await this.usersRepository.create({
			first_name: firstName,
			last_name: lastName,
			email,
			username,
		});

		if (!user) {
			return null;
		}

		const credentials = await this.credentialsRepository.create({
			user_id: user.id,
			type: CredentialsType.PASSWORD,
			secret_data: hashedPassword,
		});

		if (!credentials) {
			await this.usersRepository.delete(user.id);
			return null;
		}

		this.userRolesService.addRoleToUser(user.id, 'user', true);

// 		await db.insert(collections).values({
// 			user_id: user[0].id,
// 		});
// 		await db.insert(wishlists).values({
// 			user_id: user[0].id,
// 		});

		return this.usersRepository.create(data);
	}

	async findOneByUsername(username: string) {
		return this.usersRepository.findOneByUsername(username);
	}

	async findOneById(id: string) {
		return this.usersRepository.findOneById(id);
	}
}