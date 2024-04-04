// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// src/app.d.ts
declare global {
	namespace App {
		interface PageData {
			flash?: { type: 'success' | 'error' | 'info'; message: string; data: any };
		}
		interface Locals {
			auth: import('lucia').AuthRequest;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			startTimer: number;
			ip: string;
			country: string;
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

	interface Document {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		startViewTransition: (callback: any) => void; // Add your custom property/method here
	}
}

// interface PageData {}
// interface Error {}
// interface Platform {}

// /// <reference types="lucia" />
// declare global {
// 	namespace Lucia {
// 		type Auth = import('$lib/server/lucia').Auth;
// 		type DatabaseUserAttributes = User;
// 		type DatabaseSessionAttributes = {};
// 	}
// }

// THIS IS IMPORTANT!!!
export {};
