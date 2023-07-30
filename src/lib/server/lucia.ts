// lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { prisma } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

const client = new PrismaClient();

export const auth = lucia({
	adapter: prisma(client),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
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
