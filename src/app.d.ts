import type { ApiClient } from '$lib/server/api';
import type { Users } from '$lib/server/api/databases/postgres/tables';
import type { Session } from '$lib/server/api/iam/sessions/sessions.service';
import type { parseApiResponse } from '$lib/utils/api';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
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
      getAuthedUser: () => Promise<Returned<Record<Users, Session>> | null>;
      getAuthedUserOrThrow: () => Promise<Returned<Record<Users, Session>>>;
    }
    namespace Superforms {
      type Message = {
        type: 'error' | 'success' | 'info';
        text: string;
      };
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
