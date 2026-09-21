import type { RequestEvent } from '@sveltejs/kit'
import { Roles } from '#lib/roles.ts'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryDataProvider, remult, repo } from 'remult'

import { getUser, signIn, startImpersonation, stopImpersonation } from './auth.server.ts'
import { User } from './User.ts'

/** Just enough of a RequestEvent for the cookie jar our session code touches. */
function fakeEvent() {
	const jar = new Map<string, string>()
	return {
		cookies: {
			get: (name: string) => jar.get(name),
			set: (name: string, value: string) => jar.set(name, value),
			delete: (name: string) => jar.delete(name),
		},
	} as unknown as RequestEvent
}

describe('sign in', () => {
	beforeEach(() => {
		remult.dataProvider = new InMemoryDataProvider()
		remult.user = undefined
	})

	it('hands the whole app to the first account', async () => {
		const event = fakeEvent()
		expect(await signIn(event, 'first@example.com')).toEqual({ ok: true })

		const user = await repo(User).findFirst({ email: 'first@example.com' })
		expect(user?.roles).toContain(Roles.admin)
		expect(await getUser(event)).toMatchObject({ name: 'first' })
	})

	it('gives everyone after that nothing', async () => {
		await signIn(fakeEvent(), 'first@example.com')
		await signIn(fakeEvent(), 'second@example.com')

		const second = await repo(User).findFirst({ email: 'second@example.com' })
		expect(second?.roles).toEqual([])
	})

	it('reuses the account instead of creating twins', async () => {
		await signIn(fakeEvent(), 'SAME@example.com')
		await signIn(fakeEvent(), ' same@example.com ')

		expect(await repo(User).count()).toBe(1)
	})

	it('refuses a non-email', async () => {
		expect(await signIn(fakeEvent(), 'nope')).toEqual({ error: expect.any(String) })
		expect(await repo(User).count()).toBe(0)
	})
})

describe('impersonation', () => {
	beforeEach(() => {
		remult.dataProvider = new InMemoryDataProvider()
	})

	it('remembers who you really are, and gives you back', async () => {
		const event = fakeEvent()
		await signIn(event, 'admin@example.com')
		const other = await repo(User).insert({ email: 'other@example.com', name: 'other' })

		startImpersonation(event, other.id)
		const seen = await getUser(event)
		expect(seen).toMatchObject({ name: 'other', impersonatorName: 'admin' })

		stopImpersonation(event)
		expect(await getUser(event)).toMatchObject({ name: 'admin', impersonatorName: undefined })
	})
})
