import type { z } from 'zod';
import { userDto } from './user.dto';

export const updateUserDto = userDto
  .pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true,
    avatar: true,
  })
  .optional();

export type UpdateUserDto = z.infer<typeof updateUserDto>;
