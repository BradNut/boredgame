// lib/server/lucia.ts
import { Lucia, TimeSpan } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import prisma_client from '$lib/prisma';
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto as Crypto;

const adapter = new PrismaAdapter(prisma_client.session, prisma_client.user);

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (attributes) => {
		return {
			country: attributes.country,
		};
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			firstName: attributes.firstName,
			lastName: attributes.lastName,
			theme: attributes.theme
		};
	},
	sessionExpiresIn: new TimeSpan(30, "d"), // 30 days
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev,
			sameSite: 'strict',
			domain: dev ? 'localhost' : 'boredgame.vercel.app',
		}
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
	interface DatabaseSessionAttributes {
		country: string;
	}
	interface DatabaseUserAttributes {
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		theme: string;
	}
}
