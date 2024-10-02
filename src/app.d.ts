import type { User } from 'lucia';
import type { ApiClient } from '$lib/server/api';
import type { parseApiResponse } from '$lib/utils/api';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

// src/app.d.ts
declare global {
	namespace App {
		interface PageData {
			flash?: {
				type: 'success' | 'error' | 'info';
				message: string;
				data?: Record<string, unknown>;
			};
		}
		interface Locals {
			api: ApiClient['api'];
			parseApiResponse: typeof parseApiResponse;
			getAuthedUser: () => Promise<Returned<User> | null>;
			getAuthedUserOrThrow: () => Promise<Returned<User>>;
		}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success' | 'info',
				text: string
			}
		}
		interface Error {
			code?: string;
			errorId?: string;
		}
	}

	interface Document {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				startViewTransition: (callback: never) => void; // Add your custom property/method here
	}
}

// THIS IS IMPORTANT!!!
// biome-ignore lint/complexity/noUselessEmptyExport: <explanation>
// biome-ignore lint/style/useExportType: <explanation>
export {};
