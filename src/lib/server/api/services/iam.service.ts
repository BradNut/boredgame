import type { UpdateEmailDto } from '$lib/server/api/dtos/update-email.dto'
import type { UpdateProfileDto } from '$lib/server/api/dtos/update-profile.dto'
import type { VerifyPasswordDto } from '$lib/server/api/dtos/verify-password.dto'
import { LuciaService } from '$lib/server/api/services/lucia.service'
import { UsersService } from '$lib/server/api/services/users.service'
import { inject, injectable } from 'tsyringe'

/* -------------------------------------------------------------------------- */
/*                                   Service                                  */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Services are responsible for handling business logic and data manipulation.
They generally call on repositories or other services to complete a use-case.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
Services should be kept as clean and simple as possible.

Create private functions to handle complex logic and keep the public methods as
simple as possible. This makes the service easier to read, test and understand.
*/
/* -------------------------------------------------------------------------- */
@injectable()
export class IamService {
	constructor(
		@inject(LuciaService) private luciaService: LuciaService,
		@inject(UsersService) private readonly usersService: UsersService,
	) {}

	async logout(sessionId: string) {
		return this.luciaService.lucia.invalidateSession(sessionId)
	}

	async updateProfile(userId: string, data: UpdateProfileDto) {
		const user = await this.usersService.findOneById(userId)
		if (!user) {
			return {
				error: 'User not found',
			}
		}

		const existingUserForNewUsername = await this.usersService.findOneByUsername(data.username)
		if (existingUserForNewUsername && existingUserForNewUsername.id !== userId) {
			return {
				error: 'Username already in use',
			}
		}

		return this.usersService.updateUser(userId, {
			first_name: data.firstName,
			last_name: data.lastName,
			username: data.username !== user.username ? data.username : user.username,
		})
	}

	async updateEmail(userId: string, data: UpdateEmailDto) {
		const { email } = data

		const existingUserEmail = await this.usersService.findOneByEmail(email)
		if (existingUserEmail && existingUserEmail.id !== userId) {
			return null
		}

		return this.usersService.updateUser(userId, {
			email,
		})
	}

	async verifyPassword(userId: string, data: VerifyPasswordDto) {
		const user = await this.usersService.findOneById(userId)
		if (!user) {
			return null
		}
		const { password } = data
		return this.usersService.verifyPassword(userId, { password })
	}
}
