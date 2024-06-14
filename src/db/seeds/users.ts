import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { type db } from '$db';
import * as schema from '$db/schema';
import users from './data/users.json';
import env from '../../env';

type JsonUser = {
	id: string;
	username: string;
	email: string;
	password: string;
	roles: {
		name: string;
		primary: boolean;
	}[];
};

type JsonRole = {
	name: string;
	primary: boolean;
};

export default async function seed(db: db) {
	const adminRole = await db.select().from(schema.roles).where(eq(schema.roles.name, 'admin'));
	const userRole = await db.select().from(schema.roles).where(eq(schema.roles.name, 'user'));

	console.log('Admin Role: ', adminRole);
	const adminUser = await db
		.insert(schema.users)
		.values({
			username: `${env.ADMIN_USERNAME}`,
			email: '',
			hashed_password: await new Argon2id().hash(`${env.ADMIN_PASSWORD}`),
			first_name: 'Brad',
			last_name: 'S',
			verified: true,
		})
		.returning()
		.onConflictDoNothing();

	console.log('Admin user created.', adminUser);

	await db
		.insert(schema.userRoles)
		.values({
			user_id: adminUser[0].id,
			role_id: adminRole[0].id,
		})
		.onConflictDoNothing();

	console.log('Admin user given admin role.');

	await db
		.insert(schema.userRoles)
		.values({
			user_id: adminUser[0].id,
			role_id: userRole[0].id,
		})
		.onConflictDoNothing();

	console.log('Admin user given user role.');
	await Promise.all(
		users.map(async (user) => {
			const [insertedUser] = await db
				.insert(schema.users)
				.values({
					...user,
					hashed_password: await new Argon2id().hash(user.password),
				})
				.returning();
			await db.insert(schema.collections).values({ user_id: insertedUser?.id });
			await db.insert(schema.wishlists).values({ user_id: insertedUser?.id });
			await Promise.all(
				user.roles.map(async (role: JsonRole) => {
					const foundRole = await db.query.roles.findFirst({
						where: eq(schema.roles.name, role.name),
					});
					await db.insert(schema.userRoles).values({
						user_id: insertedUser?.id,
						role_id: foundRole?.id,
						primary: role?.primary,
					});
				}),
			);
		}),
	);
}
