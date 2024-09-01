import type { DatabaseProvider } from '$lib/server/api/providers/database.provider'

export interface Repository {
	trxHost(trx: DatabaseProvider): any
}
