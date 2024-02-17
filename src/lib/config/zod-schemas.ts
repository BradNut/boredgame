import { z } from 'zod';

export type ListGame = {
	id: string;
	game_name: string;
	game_id: string;
	collection_id: string;
	wishlist_id: string;
	times_played: number;
	thumb_url: string | null;
	in_collection: boolean;
	in_wishlist: boolean;
};

export const modifyListGameSchema = z.object({
	id: z.string()
});

export type ModifyListGame = typeof modifyListGameSchema;

export const userSchema = z.object({
	firstName: z.string().trim().optional(),
	lastName: z.string().trim().optional(),
	email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
	username: z
		.string()
		.trim()
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(50, { message: 'Username must be less than 50 characters' }),
	password: z
		.string({ required_error: 'Password is required' })
		.trim()
		.min(8, { message: 'Password must be at least 8 characters' })
		.max(128, { message: 'Password must be less than 128 characters' }),
	confirm_password: z
		.string({ required_error: 'Confirm Password is required' })
		.trim()
		.min(8, { message: 'Confirm Password must be at least 8 characters' }),
	role: z.enum(['USER', 'ADMIN'], { required_error: 'You must have a role' }).default('USER'),
	verified: z.boolean().default(false),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(false),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});

export const signUpSchema = userSchema
	.pick({
		firstName: true,
		lastName: true,
		email: true,
		username: true,
		password: true,
		confirm_password: true,
		terms: true
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		refinePasswords(confirm_password, password, ctx);
	});

export const signInSchema = userSchema.pick({
	username: true,
	password: true
});

export const updateUserPasswordSchema = userSchema
	.pick({ password: true, confirm_password: true })
	.superRefine(({ confirm_password, password }, ctx) => {
		refinePasswords(confirm_password, password, ctx);
	});

export const changeUserPasswordSchema = z
	.object({
		current_password: z.string({ required_error: 'Current Password is required' }),
		password: z
			.string({ required_error: 'Password is required' })
			.trim(),
		confirm_password: z
			.string({ required_error: 'Confirm Password is required' })
			.trim()
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		refinePasswords(confirm_password, password, ctx);
	});

const refinePasswords = async function(confirm_password: string, password: string, ctx: z.RefinementCtx) {
	comparePasswords(confirm_password, password, ctx);
	checkPasswordStrength(password, ctx);
}

const comparePasswords = async function(confirm_password: string, password: string, ctx: z.RefinementCtx) {
	if (confirm_password !== password) {
		ctx.addIssue({
			code: 'custom',
			message: 'Password and Confirm Password must match',
			path: ['confirm_password']
		});
	}
}

const checkPasswordStrength = async function (password: string, ctx: z.RefinementCtx) {
	const minimumLength = password.length < 8;
	const maximumLength = password.length > 128;
	const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
	const containsLowercase = (ch: string) => /[a-z]/.test(ch);
	const containsSpecialChar = (ch: string) =>
		/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
	let countOfUpperCase = 0,
		countOfLowerCase = 0,
		countOfNumbers = 0,
		countOfSpecialChar = 0;
	for (let i = 0; i < password.length; i++) {
		const char = password.charAt(i);
		if (!isNaN(+char)) countOfNumbers++;
		else if (containsUppercase(char)) countOfUpperCase++;
		else if (containsLowercase(char)) countOfLowerCase++;
		else if (containsSpecialChar(char)) countOfSpecialChar++;
	}

	let errors = {
		upperCase: { pass: true, message: "At least one upper case." },
		lowerCase: { pass: true, message: "At least one lower case." },
		specialCharacter: { pass: true, message: "At least one special character." },
		totalNumber: { pass: true, message: "At least one number." },
		minimumLength: { pass: true, message: "At least 8 characters." },
		maximumLength: { pass: true, message: "At most 128 characters." },
	};

	if (countOfLowerCase < 1) {
		errors = { ...errors, lowerCase: { ...errors.lowerCase, pass: false } };
	}
	if (countOfNumbers < 1) {
		errors = {
			...errors,
			totalNumber: { ...errors.totalNumber, pass: false },
		};
	}
	if (countOfUpperCase < 1) {
		errors = { ...errors, upperCase: { ...errors.upperCase, pass: false } };
	}
	if (countOfSpecialChar < 1) {
		errors = { ...errors, specialCharacter: { ...errors.specialCharacter, pass: false } };
	}
	if (minimumLength) {
		errors = { ...errors, minimumLength: { ...errors.minimumLength, pass: false } };
	}
	if (maximumLength) {
		errors = { ...errors, maximumLength: { ...errors.maximumLength, pass: false } };
	}


	if (
		countOfLowerCase < 1 ||
		countOfUpperCase < 1 ||
		countOfSpecialChar < 1 ||
		countOfNumbers < 1
	) {
		ctx.addIssue({
			code: "custom",
			message: JSON.stringify(errors),
			path: ["password"]
		});
	}
}