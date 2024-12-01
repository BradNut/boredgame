import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const userDto = z.object({
  id: z.string(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z.string().trim().max(64, { message: 'Email must be less than 64 characters' }).optional(),
  username: z.string().trim().min(3, { message: 'Must be at least 3 characters' }).max(50, { message: 'Must be less than 50 characters' }),
  avatar: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, 'File size must be less than 3MB')
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file!.type);
    }, 'File must be a PNG'),
});

export type UserDto = z.infer<typeof userDto>;
