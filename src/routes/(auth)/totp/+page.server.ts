import { notSignedInMessage } from '$lib/flashMessages'
import env from '$lib/server/api/common/env'
import { twoFactorTable, usersTable } from '$lib/server/api/databases/tables'
import { db } from '$lib/server/api/packages/drizzle'
import { recoveryCodeSchema, totpSchema } from '$lib/validations/auth'
import { type Actions, fail } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'
import { redirect } from 'sveltekit-flash-message/server'
import { zod } from 'sveltekit-superforms/adapters'
import { superValidate } from 'sveltekit-superforms/server'
import type { PageServerLoad, RequestEvent } from './$types'

export const load: PageServerLoad = async (event) => {
	const { locals } = event

	const authedUser = await locals.getAuthedUser()
	if (!authedUser) {
		throw redirect(302, '/login', notSignedInMessage, event)
	}

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.username, authedUser.username),
	})

	const twoFactorDetails = await db.query.twoFactorTable.findFirst({
		where: eq(twoFactorTable.userId, authedUser.id),
	})

	if (!twoFactorDetails || !twoFactorDetails.enabled) {
		const message = {
			type: 'error',
			message: 'Two factor authentication is not enabled',
		} as const
		redirect(302, '/login', message, event)
	}

	let twoFactorInitiatedTime = twoFactorDetails.initiatedTime
	if (twoFactorInitiatedTime === null) {
		console.log('twoFactorInitiatedTime is null')
		twoFactorInitiatedTime = new Date()
		console.log('twoFactorInitiatedTime', twoFactorInitiatedTime)
		await db.update(twoFactorTable).set({ initiatedTime: twoFactorInitiatedTime }).where(eq(twoFactorTable.userId, dbUser!.id!))
	}

	// Check if two factor started less than TWO_FACTOR_TIMEOUT
	// const totpElapsed = totpTimeElapsed(twoFactorInitiatedTime)
	// if (totpElapsed) {
	// 	console.log('Time elapsed was more than TWO_FACTOR_TIMEOUT', totpElapsed, env.TWO_FACTOR_TIMEOUT)
	// 	await lucia.invalidateSession(session!.id!)
	// 	const sessionCookie = lucia.createBlankSessionCookie()
	// 	cookies.set(sessionCookie.name, sessionCookie.value, {
	// 		path: '.',
	// 		...sessionCookie.attributes,
	// 	})
	// 	const message = { type: 'error', message: 'Two factor authentication has expired' } as const
	// 	redirect(302, '/login', message, event)
	// }
	//
	// const isTwoFactorAuthenticated = session?.isTwoFactorAuthenticated
	//
	// console.log('session', session)
	// console.log('isTwoFactorAuthenticated', isTwoFactorAuthenticated)

	// if (isTwoFactorAuthenticated && twoFactorDetails?.enabled && twoFactorDetails?.secret !== '') {
	// 	const message = { type: 'success', message: 'You are already signed in' } as const
	// 	throw redirect('/', message, event)
	// }

	return {
		totpForm: await superValidate(event, zod(totpSchema)),
		recoveryCodeForm: await superValidate(event, zod(recoveryCodeSchema)),
	}
}

export const actions: Actions = {
	validateTotp: async (event) => {
		const { locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}

		const { dbUser, twoFactorDetails } = await validateUserData(event, locals)

		const totpForm = await superValidate(event, zod(totpSchema))

		if (!totpForm.valid) {
			totpForm.data.totpToken = ''
			return fail(400, { totpForm })
		}

		// let sessionCookie
		// const totpToken = totpForm?.data?.totpToken
		//
		// const twoFactorSecretPopulated = twoFactorDetails.secret !== '' && twoFactorDetails.secret !== null
		// if (twoFactorDetails.enabled && !twoFactorSecretPopulated && !totpToken) {
		// 	return fail(400, { totpForm })
		// } else if (twoFactorSecretPopulated && totpToken) {
		// 	// Check if two factor started less than TWO_FACTOR_TIMEOUT
		// 	const totpElapsed = totpTimeElapsed(twoFactorDetails.initiatedTime ?? new Date())
		// 	if (totpElapsed) {
		// 		await lucia.invalidateSession(session!.id!)
		// 		const sessionCookie = lucia.createBlankSessionCookie()
		// 		cookies.set(sessionCookie.name, sessionCookie.value, {
		// 			path: '.',
		// 			...sessionCookie.attributes,
		// 		})
		// 		const message = {
		// 			type: 'error',
		// 			message: 'Two factor authentication has expired',
		// 		} as const
		// 		redirect(302, '/login', message, event)
		// 	}
		//
		// 	console.log('totpToken', totpToken)
		// 	const validOTP = await new TOTPController().verify(totpToken, decodeHex(twoFactorDetails.secret ?? ''))
		// 	console.log('validOTP', validOTP)
		//
		// 	if (!validOTP) {
		// 		console.log('invalid TOTP code')
		// 		totpForm.data.totpToken = ''
		// 		return setError(totpForm, 'totpToken', 'Invalid code.')
		// 	}
		// }
		// console.log('ip', locals.ip)
		// console.log('country', locals.country)
		// await lucia.invalidateSession(session.id)
		// const newSession = await lucia.createSession(dbUser.id, {
		// 	ip_country: locals.country,
		// 	ip_address: locals.ip,
		// 	twoFactorAuthEnabled: true,
		// 	isTwoFactorAuthenticated: true,
		// })
		// console.log('logging in session', newSession)
		// sessionCookie = lucia.createSessionCookie(newSession.id)
		// console.log('logging in session cookie', sessionCookie)
		//
		// console.log('setting session cookie', sessionCookie)
		// event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 	path: '.',
		// 	...sessionCookie.attributes,
		// })
		//
		// totpForm.data.totpToken = ''
		// const message = { type: 'success', message: 'Signed In!' } as const
		redirect(302, '/', message, event)
	},
	validateRecoveryCode: async (event) => {
		const { cookies, locals } = event

		const authedUser = await locals.getAuthedUser()
		if (!authedUser) {
			throw redirect(302, '/login', notSignedInMessage, event)
		}

		const { dbUser, twoFactorDetails } = await validateUserData(event, locals)

		const recoveryCodeForm = await superValidate(event, zod(recoveryCodeSchema))
		if (!recoveryCodeForm.valid) {
			return fail(400, {
				form: recoveryCodeForm,
			})
		}

		// let sessionCookie
		// const recoveryCode = recoveryCodeForm?.data?.recoveryCode
		//
		// const twoFactorSecretPopulated = twoFactorDetails.secret !== '' && twoFactorDetails.secret !== null
		// if (twoFactorDetails.enabled && !twoFactorSecretPopulated && !recoveryCode) {
		// 	return fail(400, { recoveryCodeForm })
		// } else if (twoFactorSecretPopulated && recoveryCode) {
		// 	// Check if two factor started less than TWO_FACTOR_TIMEOUT
		// 	const totpElapsed = totpTimeElapsed(twoFactorDetails.initiatedTime ?? new Date())
		// 	if (totpElapsed) {
		// 		await lucia.invalidateSession(session!.id!)
		// 		const sessionCookie = lucia.createBlankSessionCookie()
		// 		cookies.set(sessionCookie.name, sessionCookie.value, {
		// 			path: '.',
		// 			...sessionCookie.attributes,
		// 		})
		// 		const message = {
		// 			type: 'error',
		// 			message: 'Two factor authentication has expired',
		// 		} as const
		// 		redirect(302, '/login', message, event)
		// 	}
		//
		// 	console.log('recoveryCode', recoveryCode)
		//
		// 	console.log('Check for recovery codes')
		// 	const usedRecoveryCode = await checkRecoveryCode(recoveryCode, dbUser.id)
		// 	if (!usedRecoveryCode) {
		// 		console.log('invalid recovery code')
		// 		recoveryCodeForm.data.recoveryCode = ''
		// 		return setError(recoveryCodeForm, 'recoveryCode', 'Invalid code.')
		// 	}
		// }
		// console.log('ip', locals.ip)
		// console.log('country', locals.country)
		// await lucia.invalidateSession(session.id)
		// const newSession = await lucia.createSession(dbUser.id, {
		// 	ip_country: locals.country,
		// 	ip_address: locals.ip,
		// 	twoFactorAuthEnabled: true,
		// 	isTwoFactorAuthenticated: true,
		// })
		// console.log('logging in session', newSession)
		// sessionCookie = lucia.createSessionCookie(newSession.id)
		// console.log('logging in session cookie', sessionCookie)
		//
		// console.log('setting session cookie', sessionCookie)
		// event.cookies.set(sessionCookie.name, sessionCookie.value, {
		// 	path: '.',
		// 	...sessionCookie.attributes,
		// })

		recoveryCodeForm.data.recoveryCode = ''
		const message = { type: 'success', message: 'Signed In!' } as const
		redirect(302, '/', message, event)
	},
}

async function validateUserData(event: RequestEvent, locals: App.Locals) {
	const { user, session } = locals

	if (!user || !session) {
		throw fail(401)
	}

	const dbUser = await db.query.usersTable.findFirst({
		where: eq(usersTable.username, user.username),
	})

	if (!dbUser) {
		throw fail(401)
	}

	const isTwoFactorAuthenticated = session?.isTwoFactorAuthenticated
	const twoFactorDetails = await db.query.twoFactorTable.findFirst({
		where: eq(twoFactorTable.userId, dbUser!.id!),
	})

	if (!twoFactorDetails) {
		const message = { type: 'error', message: 'Unable to process request' } as const
		throw redirect(302, '/login', message, event)
	}

	if (isTwoFactorAuthenticated && twoFactorDetails.enabled && twoFactorDetails.secret !== '') {
		const message = { type: 'success', message: 'You are already signed in' } as const
		throw redirect('/', message, event)
	}
	return { dbUser, twoFactorDetails }
}

function totpTimeElapsed(initiatedTime: Date) {
	if (initiatedTime === null || initiatedTime === undefined) {
		return true
	}

	const timeElapsed = Date.now() - initiatedTime.getTime()
	console.log('Time elapsed', timeElapsed)
	if (timeElapsed > env.TWO_FACTOR_TIMEOUT) {
		console.log('Time elapsed was more than TWO_FACTOR_TIMEOUT', timeElapsed, env.TWO_FACTOR_TIMEOUT)
		return true
	}
	return false
}

async function checkRecoveryCode(recoveryCode: string, userId: string) {
	const userRecoveryCodes = await db.query.recoveryCodesTable.findMany({
		where: and(eq(recoveryCodesTable.used, false), eq(recoveryCodesTable.userId, userId)),
	})
	for (const code of userRecoveryCodes) {
		const validRecoveryCode = await new Argon2id().verify(code.code, recoveryCode)
		if (validRecoveryCode) {
			await db
				.update(recoveryCodesTable)
				.set({
					used: true,
				})
				.where(eq(recoveryCodesTable.id, code.id))
			return true
		}
	}
	return false
}
