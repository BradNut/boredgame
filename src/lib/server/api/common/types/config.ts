export interface Config {
	isProduction: boolean
	domain: string
	api: ApiConfig
	// storage: StorageConfig
	redis: RedisConfig
	postgres: PostgresConfig
}

interface ApiConfig {
	origin: string
}

// interface StorageConfig {
// 	accessKey: string
// 	secretKey: string
// 	bucket: string
// 	url: string
// }

interface RedisConfig {
	url: string
}

interface PostgresConfig {
	user: string
	password: string
	host: string
	port: number
	database: string
	ssl: boolean
	max: number | undefined
}
