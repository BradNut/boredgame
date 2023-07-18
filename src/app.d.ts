// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { AuthUser } from '@prisma/client';

type User = Omit<AuthUser, 'created_at' | 'updated_at'>;

// src/app.d.ts
declare global {
	namespace App {
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
			prisma: PrismaClient;
			user: Lucia.UserAttributes;
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			message: unknown;
			track: unknown;
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
	}
}

// interface PageData {}
// interface Error {}
// interface Platform {}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/lucia').Auth;
		type UserAttributes = User;
	}
}

// THIS IS IMPORTANT!!!
export {};
