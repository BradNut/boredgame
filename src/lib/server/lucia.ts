// lib/server/lucia.ts
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: prisma(new PrismaClient()),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			id: userData.id,
			username: userData.username,
			email: userData.email,
			firstName: userData.firstName,
			lastName: userData.lastName,
			verified: userData.verified,
			receiveEmail: userData.receiveEmail,
			token: userData.token,
			theme: userData.theme
		};
	},
	experimental: {
		debugMode: false
	}
});

export type Auth = typeof auth;
