import { forbiddenMessage, notSignedInMessage } from '$lib/flashMessages'
import { rolesTable, user_roles, usersTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { and, eq, inArray, not } from 'drizzle-orm'
import { redirect } from 'sveltekit-flash-message/server'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const { params, locals } = event
	const { id } = params

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	const foundUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.cuid, id),
		with: {
			user_roles: {
				with: {
					role: {
						columns: {
							name: true,
							cuid: true,
						},
					},
				},
			},
		},
	})

	const containsAdminRole = foundUser?.user_roles?.some((user_role) => user_role?.role?.name === 'admin')
	if (!containsAdminRole) {
		console.log('Not an admin')
		redirect(302, '/login', notSignedInMessage, event)
	}

	const currentRoleIds = foundUser?.user_roles?.map((user_role) => user_role?.role.cuid) || []
	let availableRoles: { name: string; cuid: string }[] = []
	if (currentRoleIds?.length > 0) {
		availableRoles = await db.query.roles.findMany({
			where: not(inArray(rolesTable.cuid, currentRoleIds)),
			columns: {
				name: true,
				cuid: true,
			},
		})
	}

	return {
		user: foundUser,
		availableRoles,
	}
}

export const actions = {
	addRole: async (event) => {
		const { request, locals } = event
		const { user } = locals

		if (!user) {
			redirect(302, '/login', notSignedInMessage, event)
		}

		const userRolesList = await db.query.user_roles.findMany({
			where: eq(user_roles.user_id, user.id),
			with: {
				role: {
					columns: {
						name: true,
						cuid: true,
					},
				},
			},
		})

		console.log('userRoles', userRolesList)

		const containsAdminRole = userRolesList.some((user_role) => user_role?.role?.name === 'admin')
		console.log('containsAdminRole', containsAdminRole)
		if (!containsAdminRole) {
			redirect(302, '/', forbiddenMessage, event)
		}

		const data = await request.formData()
		const role = data.get('role')
		const dbRole = await db.query.roles.findFirst({
			where: eq(rolesTable.cuid, role?.toString() ?? ''),
		})
		console.log('dbRole', dbRole)
		if (dbRole) {
			await db.insert(user_roles).values({
				user_id: user.id,
				role_id: dbRole.id,
			})
			redirect({ type: 'success', message: `Successfully added role ${dbRole.name}!` }, event)
		} else {
			redirect({ type: 'error', message: `Failed to add role ${role?.toString()}!` }, event)
		}
	},
	removeRole: async (event) => {
		const { request, locals } = event
		const { user } = locals
		if (!user) {
			redirect(302, '/login', notSignedInMessage, event)
		}

		const userRolesList = await db.query.user_roles.findMany({
			where: eq(user_roles.user_id, user.id),
			with: {
				role: {
					columns: {
						name: true,
						cuid: true,
					},
				},
			},
		})

		const containsAdminRole = userRolesList.some((user_role) => user_role?.role?.name === 'admin')
		if (!containsAdminRole) {
			redirect(302, '/', forbiddenMessage, event)
		}

		const data = await request.formData()
		const role = data.get('role')
		const dbRole = await db.query.roles.findFirst({
			where: eq(rolesTable.cuid, role?.toString() ?? ''),
		})
		console.log('dbRole', dbRole)
		if (dbRole) {
			await db.delete(user_roles).where(and(eq(user_roles.user_id, user.id), eq(user_roles.role_id, dbRole.id)))
			redirect({ type: 'success', message: `Successfully removed role ${dbRole.name}!` }, event)
		} else {
			redirect({ type: 'error', message: `Failed to remove role ${role?.toString()} !` }, event)
		}
	},
}
