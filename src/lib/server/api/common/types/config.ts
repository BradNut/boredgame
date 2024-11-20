export interface Config {
	isProduction: boolean;
	domain: string;
	api: ApiConfig;
	// storage: StorageConfig
	redis: RedisConfig;
	postgres: PostgresConfig;
	security: SecurityConfig;
}

interface ApiConfig {
	origin: string;
}

// interface StorageConfig {
// 	accessKey: string
// 	secretKey: string
// 	bucket: string
// 	url: string
// }

interface RedisConfig {
	url: string;
}

interface PostgresConfig {
	user: string;
	password: string;
	host: string;
	port: number;
	database: string;
	ssl: boolean;
	max: number | undefined;
	migrating: boolean;
	seeding: boolean;
}

interface SecurityConfig {
	encryptionKey: string;
}