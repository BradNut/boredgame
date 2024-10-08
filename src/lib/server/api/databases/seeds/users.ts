import { eq } from 'drizzle-orm'
import type { db } from '../../packages/drizzle'
import { HashingService } from '../../services/hashing.service'
import * as schema from '../tables'
import users from './data/users.json'

type JsonRole = {
	name: string
	primary: boolean
}

export default async function seed(db: db) {
	const hashingService = new HashingService()
	const adminRole = await db.select().from(schema.rolesTable).where(eq(schema.rolesTable.name, 'admin'))
	const userRole = await db.select().from(schema.rolesTable).where(eq(schema.rolesTable.name, 'user'))

	console.log('Admin Role: ', adminRole)
	const adminUser = await db
		.insert(schema.usersTable)
		.values({
			username: `${process.env.ADMIN_USERNAME}`,
			email: '',
			first_name: 'Brad',
			last_name: 'S',
			verified: true,
		})
		.returning()
		.onConflictDoNothing()

	console.log('Admin user created.', adminUser)

	await db.insert(schema.credentialsTable).values({
		user_id: adminUser[0].id,
		type: schema.CredentialsType.PASSWORD,
		secret_data: await hashingService.hash(`${process.env.ADMIN_PASSWORD}`),
	})

	await db.insert(schema.collections).values({ user_id: adminUser[0].id }).onConflictDoNothing()

	await db.insert(schema.wishlistsTable).values({ user_id: adminUser[0].id }).onConflictDoNothing()

	await db
		.insert(schema.user_roles)
		.values({
			user_id: adminUser[0].id,
			role_id: adminRole[0].id,
			primary: true,
		})
		.onConflictDoNothing()

	console.log('Admin user given admin role.')

	await db
		.insert(schema.user_roles)
		.values({
			user_id: adminUser[0].id,
			role_id: userRole[0].id,
			primary: false,
		})
		.onConflictDoNothing()

	console.log('Admin user given user role.')
	const hasingService = new HashingService()
	await Promise.all(
		users.map(async (user) => {
			const [insertedUser] = await db
				.insert(schema.usersTable)
				.values({
					...user,
				})
				.returning()
			await db.insert(schema.credentialsTable).values({
				user_id: insertedUser?.id,
				type: schema.CredentialsType.PASSWORD,
				secret_data: await hasingService.hash(user.password),
			})
			await db.insert(schema.collections).values({ user_id: insertedUser?.id })
			await db.insert(schema.wishlistsTable).values({ user_id: insertedUser?.id })
			await Promise.all(
				user.roles.map(async (role: JsonRole) => {
					const foundRole = await db.query.rolesTable.findFirst({
						where: eq(schema.rolesTable.name, role.name),
					})
					if (!foundRole) {
						throw new Error('Role not found')
					}
					await db.insert(schema.user_roles).values({
						user_id: insertedUser?.id,
						role_id: foundRole?.id,
						primary: role?.primary,
					})
				}),
			)
		}),
	)
}
