// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(new PrismaClient()),
	getUserAttributes: (databaseUser) => {
		return {
			username: databaseUser.username,
			email: databaseUser.email,
			firstName: databaseUser.firstName,
			lastName: databaseUser.lastName,
			verified: databaseUser.verified,
			receiveEmail: databaseUser.receiveEmail,
			token: databaseUser.token,
			theme: databaseUser.theme
		};
	},
	experimental: {
		debugMode: false
	}
});

export type Auth = typeof auth;
