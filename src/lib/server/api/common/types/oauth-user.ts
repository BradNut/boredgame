export type OAuthUser = {
	sub: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
	username: string;
	email?: string;
	email_verified?: boolean;
}