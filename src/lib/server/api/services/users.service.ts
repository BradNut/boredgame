import type { SignupUsernameEmailDto } from '$lib/server/api/dtos/signup-username-email.dto'
import { CredentialsRepository } from '$lib/server/api/repositories/credentials.repository'
import { TokensService } from '$lib/server/api/services/tokens.service'
import { UserRolesService } from '$lib/server/api/services/user_roles.service'
import { inject, injectable } from 'tsyringe'
import { CredentialsType } from '../databases/tables'
import { type UpdateUser, UsersRepository } from '../repositories/users.repository'
import { CollectionsService } from './collections.service'
import { WishlistsService } from './wishlists.service'

@injectable()
export class UsersService {
	constructor(
		@inject(CollectionsService) private readonly collectionsService: CollectionsService,
		@inject(CredentialsRepository) private readonly credentialsRepository: CredentialsRepository,
		@inject(TokensService) private readonly tokenService: TokensService,
		@inject(UsersRepository) private readonly usersRepository: UsersRepository,
		@inject(UserRolesService) private readonly userRolesService: UserRolesService,
		@inject(WishlistsService) private readonly wishlistsService: WishlistsService,
	) {}

	async create(data: SignupUsernameEmailDto) {
		const { firstName, lastName, email, username, password } = data

		const hashedPassword = await this.tokenService.createHashedToken(password)
		const user = await this.usersRepository.create({
			first_name: firstName,
			last_name: lastName,
			email,
			username,
		})

		if (!user) {
			return null
		}

		const credentials = await this.credentialsRepository.create({
			user_id: user.id,
			type: CredentialsType.PASSWORD,
			secret_data: hashedPassword,
		})

		if (!credentials) {
			await this.usersRepository.delete(user.id)
			return null
		}

		await this.userRolesService.addRoleToUser(user.id, 'user', true)

		await this.wishlistsService.createEmptyNoName(user.id)
		await this.collectionsService.createEmptyNoName(user.id)

		return user
	}

	async updateUser(userId: string, data: UpdateUser) {
		return this.usersRepository.update(userId, data)
	}

	async findOneByUsername(username: string) {
		return this.usersRepository.findOneByUsername(username)
	}

	async findOneByEmail(email: string) {
		return this.usersRepository.findOneByEmail(email)
	}

	async findOneById(id: string) {
		return this.usersRepository.findOneById(id)
	}

	async updatePassword(userId: string, password: string) {
		const hashedPassword = await this.tokenService.createHashedToken(password)
		const currentCredentials = await this.credentialsRepository.findPasswordCredentialsByUserId(userId)
		if (!currentCredentials) {
			await this.credentialsRepository.create({
				user_id: userId,
				type: CredentialsType.PASSWORD,
				secret_data: hashedPassword,
			})
		} else {
			await this.credentialsRepository.update(currentCredentials.id, {
				secret_data: hashedPassword,
			})
		}
	}

	async verifyPassword(userId: string, data: { password: string }) {
		const user = await this.usersRepository.findOneById(userId)
		if (!user) {
			throw new Error('User not found')
		}
		const credential = await this.credentialsRepository.findOneByUserIdAndType(userId, CredentialsType.PASSWORD)
		if (!credential) {
			throw new Error('Password credentials not found')
		}
		const { password } = data
		return this.tokenService.verifyHashedToken(credential.secret_data, password)
	}
}
