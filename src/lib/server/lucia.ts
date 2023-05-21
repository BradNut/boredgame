// lib/server/lucia.ts
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import prisma from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

const client = new PrismaClient();

export const auth = lucia({
	adapter: prisma(client),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData) => {
		return {
			userId: userData.id,
			username: userData.username,
			email: userData.email,
			firstName: userData.firstName,
			lastName: userData.lastName,
			role: userData.role,
			verified: userData.verified,
			receiveEmail: userData.receiveEmail,
			token: userData.token
		};
	}
});

export type Auth = typeof auth;
