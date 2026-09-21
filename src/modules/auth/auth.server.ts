import type { RequestEvent } from '@sveltejs/kit'
import { ADMIN_ROLES } from '#lib/roles.ts'
import { User } from '#modules/auth/User.ts'

import { repo, type UserInfo } from 'remult'
import { sendMail } from 'firstly/mail/server'

import { dev } from '$app/env'
import { REQUIRE_EMAIL_VERIFICATION, SUPER_ADMIN_EMAILS } from '$app/env/private'

import { signSession as sign, unsignSession as unsign } from './session.server.ts'

/** Emails that are admin by configuration, not by database row. */
export const superAdminEmails = (SUPER_ADMIN_EMAILS ?? '')
	.split(',')
	.map((e) => e.trim().toLowerCase())
	.filter(Boolean)

export const isSuperAdmin = (email: string) => superAdminEmails.includes(email.toLowerCase())

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const requireEmailVerification = REQUIRE_EMAIL_VERIFICATION === true
const LINK_TTL_MS = 1000 * 60 * 30

export type SignInResult = { ok: true } | { pending: true } | { error: string }

/**
 * One door for signing in and signing up: no password, no seeded accounts.
 * The first account ever created gets every role - whoever deploys owns the app.
 */
export async function signIn(event: RequestEvent, rawEmail: string): Promise<SignInResult> {
	const email = rawEmail.trim().toLowerCase()
	if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email address' }

	let user = await repo(User).findFirst({ email })
	if (!user) {
		const isFirst = (await repo(User).count()) === 0
		user = await repo(User).insert({
			email,
			name: email.split('@')[0],
			roles: isFirst ? ADMIN_ROLES : [],
		})
	}

	if (requireEmailVerification && !user.verifiedAt) {
		await sendSignInLink(event, user)
		return { pending: true }
	}

	setSession(event, user.id)
	return { ok: true }
}

async function sendSignInLink(event: RequestEvent, user: User) {
	const token = sign(`${user.id}|${Date.now() + LINK_TTL_MS}`)
	const link = new URL(`/login/verify?token=${encodeURIComponent(token)}`, event.url.origin).href
	await sendMail('sign-in', {
		to: user.email,
		subject: 'Your sign-in link',
		sections: [
			{
				html: `Hi ${user.name}, here is your sign-in link. It expires in 30 minutes.`,
				cta: { html: 'Sign in', link },
			},
		],
	})
}

/** Consumes a link from `sendSignInLink`. Marks the email verified and opens the session. */
export async function verifySignInLink(event: RequestEvent, token: string) {
	const payload = unsign(token)
	if (!payload) return { error: 'This link is not valid' }
	const [userId, expiresAt] = payload.split('|')
	if (Number(expiresAt) < Date.now()) return { error: 'This link has expired' }

	const user = await repo(User).findId(userId)
	if (!user) return { error: 'This link is not valid' }
	if (!user.verifiedAt) await repo(User).update(user.id, { verifiedAt: new Date() })

	setSession(event, user.id)
	return { ok: true as const }
}

const SESSION = 'remult_session'
/** Who started the impersonation - lets "login as" be reversible. */
const IMPERSONATOR = 'remult_impersonator'

const cookieOptions = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	secure: !dev,
	maxAge: 60 * 60 * 24 * 7,
} as const

export function setSession(event: RequestEvent, userId: string) {
	event.cookies.set(SESSION, sign(userId), cookieOptions)
}

export function clearSession(event: RequestEvent) {
	event.cookies.delete(SESSION, { path: '/' })
	event.cookies.delete(IMPERSONATOR, { path: '/' })
}

export function currentUserId(event: RequestEvent) {
	return unsign(event.cookies.get(SESSION))
}

export function impersonatorId(event: RequestEvent) {
	return unsign(event.cookies.get(IMPERSONATOR))
}

/** Become `userId`, remembering who we really are (unless already impersonating). */
export function startImpersonation(event: RequestEvent, userId: string) {
	const real = impersonatorId(event) ?? currentUserId(event)
	if (real && real !== userId) event.cookies.set(IMPERSONATOR, sign(real), cookieOptions)
	else event.cookies.delete(IMPERSONATOR, { path: '/' })
	setSession(event, userId)
}

/** Back to the real user. Always allowed: it can only restore, never escalate. */
export function stopImpersonation(event: RequestEvent) {
	const real = impersonatorId(event)
	event.cookies.delete(IMPERSONATOR, { path: '/' })
	if (real) setSession(event, real)
	else event.cookies.delete(SESSION, { path: '/' })
	return real
}

/** Called by remult on every request, before any API rule runs. */
export async function getUser(event: RequestEvent): Promise<UserInfo | undefined> {
	const userId = currentUserId(event)
	if (!userId) return undefined
	const user = await repo(User).findId(userId)
	if (!user) return undefined
	// Roles from the row, plus everything if the email is a configured super admin.
	const roles = [...new Set([...user.roles, ...(isSuperAdmin(user.email) ? ADMIN_ROLES : [])])]
	// Impersonation travels on the user itself, so the client never needs a load function.
	const realId = impersonatorId(event)
	const real = realId ? await repo(User).findId(realId) : undefined
	return { id: user.id, name: user.name, roles, impersonatorName: real?.name }
}
