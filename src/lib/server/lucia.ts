// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import prisma_client from '$lib/prisma';

// export const prisma_client = new PrismaClient();

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: prisma(prisma_client),
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
