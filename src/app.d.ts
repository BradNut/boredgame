// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { User } from '@prisma/client';

type User = Omit<User, 'created_at' | 'updated_at'>;

// src/app.d.ts
declare global {
	namespace App {
		interface PageData {
			flash?: { type: 'success' | 'error' | 'info'; message: string };
		}
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: Lucia.UserAttributes;
			startTimer: number;
			error: string;
			errorId: string;
			errorStackTrace: string;
			message: unknown;
			track: unknown;
			session: {
				ip: string,
				country: string
			}
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
	}

	interface Document {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		startViewTransition: (callback: any) => void; // Add your custom property/method here
	}
}

// interface PageData {}
// interface Error {}
// interface Platform {}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = User;
		type DatabaseSessionAttributes = {};
	}
}

// THIS IS IMPORTANT!!!
export {};
