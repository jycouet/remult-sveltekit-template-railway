import { Roles } from '#lib/roles.ts'
import { User } from '#modules/auth/User.ts'

import { repo } from 'remult'

/** Name the profiles you actually care about. Add `{ label, email }` to pin a specific one. */
const PROFILES: { label: string; email?: string; match?: (user: User) => boolean }[] = [
	{ label: 'admin', match: (u) => u.roles.includes(Roles.admin) },
	{ label: 'member', match: (u) => !u.roles.includes(Roles.admin) },
]

/** Dev only, so a few seconds of staleness is cheaper than a query per request. */
let cache: { at: number; hint: string } | undefined

export async function devProfilesHint() {
	if (cache && Date.now() - cache.at < 5_000) return cache.hint

	const users = await repo(User).find({ limit: 10, orderBy: { createdAt: 'asc' } })
	const lines = PROFILES.map(({ label, email, match }) => {
		const user = email ? users.find((u) => u.email === email) : users.find((u) => match?.(u))
		const target = user?.email ?? email
		return `  ${label.padEnd(9)} ${target ? `?login-as=${target}` : '(none yet)'}`
	})
	lines.push('  anonymous ?login-as=')

	cache = { at: Date.now(), hint: ['switch identity:', ...lines].join('\n') }
	return cache.hint
}
