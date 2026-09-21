import { describe, expect, it } from 'vitest'

import { signSession, unsignSession } from './session.server.ts'

describe('session token', () => {
	it('round-trips a user id', () => {
		expect(unsignSession(signSession('user-1'))).toBe('user-1')
	})

	it('rejects a tampered payload', () => {
		const token = signSession('user-1')
		expect(unsignSession(token.replace('user-1', 'user-2'))).toBeUndefined()
	})

	it('rejects garbage', () => {
		expect(unsignSession('user-1.not-a-mac')).toBeUndefined()
		expect(unsignSession('nonsense')).toBeUndefined()
		expect(unsignSession(undefined)).toBeUndefined()
	})
})
