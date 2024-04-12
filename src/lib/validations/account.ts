import { z } from 'zod';
import { userSchema } from './zod-schemas';

export const profileSchema = userSchema.pick({
	firstName: true,
	lastName: true,
	username: true,
});

export const changeEmailSchema = userSchema.pick({
	email: true,
});

export const changeUserPasswordSchema = z
	.object({
		current_password: z.string({ required_error: 'Current Password is required' }),
		password: z.string({ required_error: 'Password is required' }).trim(),
		confirm_password: z.string({ required_error: 'Confirm Password is required' }).trim(),
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		refinePasswords(confirm_password, password, ctx);
	});

export type ChangeUserPasswordSchema = typeof changeUserPasswordSchema;

export const addTwoFactorSchema = z.object({
	current_password: z.string({ required_error: 'Current Password is required' }),
	two_factor_code: z.string({ required_error: 'Two Factor Code is required' }).trim(),
});

export type AddTwoFactorSchema = typeof addTwoFactorSchema;

export const removeTwoFactorSchema = addTwoFactorSchema.pick({
	current_password: true,
});

export type RemoveTwoFactorSchema = typeof removeTwoFactorSchema;

export const updateUserPasswordSchema = userSchema
	.pick({ password: true, confirm_password: true })
	.superRefine(({ confirm_password, password }, ctx) => {
		refinePasswords(confirm_password, password, ctx);
	});

export const refinePasswords = async function (
	confirm_password: string,
	password: string,
	ctx: z.RefinementCtx,
) {
	comparePasswords(confirm_password, password, ctx);
	checkPasswordStrength(password, ctx);
};

const comparePasswords = async function (
	confirm_password: string,
	password: string,
	ctx: z.RefinementCtx,
) {
	if (confirm_password !== password) {
		ctx.addIssue({
			code: 'custom',
			message: 'Password and Confirm Password must match',
			path: ['confirm_password'],
		});
	}
};

const checkPasswordStrength = async function (password: string, ctx: z.RefinementCtx) {
	const minimumLength = password.length < 8;
	const maximumLength = password.length > 128;
	const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
	const containsLowercase = (ch: string) => /[a-z]/.test(ch);
	const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
	let countOfUpperCase = 0,
		countOfLowerCase = 0,
		countOfNumbers = 0,
		countOfSpecialChar = 0;
	for (let i = 0; i < password.length; i++) {
		const char = password.charAt(i);
		if (!isNaN(+char)) {
			countOfNumbers++;
		} else if (containsUppercase(char)) {
			countOfUpperCase++;
		} else if (containsLowercase(char)) {
			countOfLowerCase++;
		} else if (containsSpecialChar(char)) {
			countOfSpecialChar++;
		}
	}

	let errorMessage = 'Your password:';

	if (countOfLowerCase < 1) {
		errorMessage = ' Must have at least one lowercase letter. ';
	}
	if (countOfNumbers < 1) {
		errorMessage += ' Must have at least one number. ';
	}
	if (countOfUpperCase < 1) {
		errorMessage += ' Must have at least one uppercase letter. ';
	}
	if (countOfSpecialChar < 1) {
		errorMessage += ' Must have at least one special character.';
	}
	if (minimumLength) {
		errorMessage += ' Be at least 8 characters long.';
	}
	if (maximumLength) {
		errorMessage += ' Be less than 128 characters long.';
	}

	if (errorMessage.length > 'Your password:'.length) {
		ctx.addIssue({
			code: 'custom',
			message: errorMessage,
			path: ['password'],
		});
	}
};

export const addRoleSchema = z.object({
	roles: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: 'You have to select at least one item.',
	}),
});

export type AddRoleSchema = typeof addRoleSchema;
