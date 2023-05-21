// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
			user: Lucia.UserAttributes;
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
		type UserAttributes = {
			email: string;
			username: string;
			firstName: string;
			lastName: string;
			role: string;
			verified: boolean;
			receiveEmail: boolean;
			token: string;
		};
	}
}

// THIS IS IMPORTANT!!!
export {};
