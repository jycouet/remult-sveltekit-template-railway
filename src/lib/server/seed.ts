import { superAdminEmails } from '#modules/auth/auth.server.ts'
import { User } from '#modules/auth/User.ts'
import { Task } from '#modules/task/Task.ts'

import { repo } from 'remult'

/** Runs at every server start. Idempotent: it only fills what is missing. */
export async function seed() {
	// No fake users: the first person to sign in owns the place (see auth.server.ts).
	for (const email of superAdminEmails) {
		await repo(User).upsert({ where: { email }, set: { name: email.split('@')[0] } })
	}
	if ((await repo(Task).count()) === 0) {
		await repo(Task).insert([
			{ title: 'Open the onboarding panel (bottom right)', priority: 'high' },
			{ title: 'Add a field to src/modules/task/Task.ts', priority: 'normal' },
		])
	}
}
