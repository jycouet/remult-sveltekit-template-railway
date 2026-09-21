import { error } from '@sveltejs/kit'
import { ADMIN_ROLES, Roles } from '#lib/roles.ts'
import {
	clearSession,
	signIn as openSession,
	startImpersonation,
	stopImpersonation,
} from '#modules/auth/auth.server.ts'
import { User } from '#modules/auth/User.ts'

import { remult, repo } from 'remult'

import { dev } from '$app/env'
import { command, form, getRequestEvent, query } from '$app/server'

/**
 * The signed-in user. Assigned to `remult.user` in the root layout, which fills it for
 * SSR (resolved in-process) and CSR (the serialized value), with no round trip either way.
 */
export const me = query(async () => remult.user ?? null)

/** Drives the sign-in copy: the first account is the one that gets every role. */
export const isFirstAccount = query(async () => (await repo(User).count()) === 0)

// No redirect here on purpose: the caller does a full page load, so the new session
// reaches remult, the entities and every live query at once.
export const signIn = form('unchecked', async (data: { email?: string }) => {
	const result = await openSession(getRequestEvent(), data.email ?? '')
	if ('error' in result) return { error: result.error, email: data.email }
	if ('pending' in result) return { pending: true, email: data.email }
	return { ok: true }
})

export const signOut = command(async () => {
	clearSession(getRequestEvent())
})

/** Impersonation: admins anywhere, anybody in dev. Reversible via `backToMe`. */
export const loginAs = command('unchecked', async (userId: string) => {
	if (!dev && !remult.isAllowed(Roles.admin)) error(403, 'Admins only')
	const user = await repo(User).findId(userId)
	if (!user) error(400, 'Unknown user')
	startImpersonation(getRequestEvent(), user.id)
})

/** Always allowed: it can only restore the real user, never escalate. */
export const backToMe = command(async () => {
	stopImpersonation(getRequestEvent())
})

/** The switcher list. Admin-only on the server, so a member gets an empty array. */
export const impersonationTargets = query(async () => {
	if (!remult.isAllowed([...ADMIN_ROLES])) return []
	const users = await repo(User).find({ limit: 20 })
	return users.map((u) => ({ id: u.id, name: u.name, email: u.email }))
})

export const addMember = command('unchecked', async (email: string) => {
	const clean = email.trim().toLowerCase()
	if (!clean.includes('@')) error(400, 'Enter a valid email address')
	if (await repo(User).findFirst({ email: clean })) error(400, 'Already a member')
	await repo(User).insert({ email: clean, name: clean.split('@')[0] })
})
