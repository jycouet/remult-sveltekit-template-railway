import { error, redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit/hooks'
import { ADMIN_ROLES } from '#lib/roles.ts'
import { clearSession, startImpersonation } from '#modules/auth/auth.server.ts'
import { devProfilesHint } from '#modules/auth/devProfiles.server.ts'
import { User } from '#modules/auth/User.ts'

import { remult, repo } from 'remult'

import { dev } from '$app/env'

/** `?login-as=someone@example.com` switches identity, `?login-as=` drops to anonymous. */
const LOGIN_AS = 'login-as'

/**
 * Runs inside remult's context (it is sequenced after `api`), so `remult.user` is set.
 * One place for every rule - no `+layout.server.ts` scattered around.
 */
export const guard: Handle = async ({ event, resolve }) => {
	const { pathname, searchParams } = event.url

	// One URL to become anybody - the fastest debugging tool there is, and the one an agent
	// can drive. Admins only once deployed.
	if (searchParams.has(LOGIN_AS) && (dev || remult.isAllowed([...ADMIN_ROLES]))) {
		const email = searchParams.get(LOGIN_AS)!.trim().toLowerCase()
		if (email) {
			const user = await repo(User).findFirst({ email })
			if (user) startImpersonation(event, user.id)
		} else {
			clearSession(event)
		}
		searchParams.delete(LOGIN_AS)
		redirect(303, `${pathname}${searchParams.size ? `?${searchParams}` : ''}`)
	}

	if (pathname.startsWith('/app/internal') && !remult.isAllowed([...ADMIN_ROLES])) {
		error(403, 'Admins only')
	}
	// Every page render reprints the switch-identity URLs: a hint you have to remember
	// is a hint nobody uses. Page requests only, dev only.
	if (dev && event.request.headers.get('accept')?.includes('text/html')) {
		console.info(await devProfilesHint())
	}

	if (pathname.startsWith('/app') && !remult.authenticated()) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(pathname)}`)
	}
	return resolve(event)
}
