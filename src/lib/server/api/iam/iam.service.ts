import type { ChangePasswordDto } from '$lib/server/api/dtos/change-password.dto';
import type { UpdateEmailDto } from '$lib/server/api/dtos/update-email.dto';
import type { UpdateProfileDto } from '$lib/server/api/dtos/update-profile.dto';
import type { VerifyPasswordDto } from '$lib/server/api/dtos/verify-password.dto';
import { SessionsService } from '$lib/server/api/iam/sessions/sessions.service';
import { UsersService } from '$lib/server/api/users/users.service';
import { inject, injectable } from '@needle-di/core';

@injectable()
export class IamService {
  constructor(
    private readonly sessionsService = inject(SessionsService),
    private readonly usersService = inject(UsersService),
  ) {}

  async logout(sessionId: string) {
    return this.sessionsService.invalidateSession(sessionId);
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      return {
        error: 'User not found',
      };
    }

    const existingUserForNewUsername = await this.usersService.findOneByUsername(data.username);
    if (existingUserForNewUsername && existingUserForNewUsername.id !== user.id) {
      return {
        error: 'Username already in use',
      };
    }

    return this.usersService.updateUser(user.id, {
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username !== user.username ? data.username : user.username,
    });
  }

  async updateEmail(userId: string, data: UpdateEmailDto) {
    const { email } = data;

    const existingUserEmail = await this.usersService.findOneByEmail(email);
    if (existingUserEmail && existingUserEmail.id !== userId) {
      return null;
    }

    return this.usersService.updateUser(userId, {
      email,
    });
  }

  async updatePassword(userId: string, data: ChangePasswordDto) {
    const { password } = data;
    await this.usersService.updatePassword(userId, password);
  }

  async verifyPassword(userId: string, data: VerifyPasswordDto) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      return null;
    }
    const { password } = data;
    return this.usersService.verifyPassword(userId, { password });
  }
}
