import { createHmac, timingSafeEqual } from 'node:crypto'

import { dev } from '$app/env'
import { AUTH_SECRET } from '$app/env/private'

function secret() {
	const s = AUTH_SECRET
	if (!s && !dev) throw new Error('AUTH_SECRET is required in production')
	return s || 'dev-only-insecure-secret'
}

export function signSession(userId: string) {
	const mac = createHmac('sha256', secret()).update(userId).digest('base64url')
	return `${userId}.${mac}`
}

export function unsignSession(token: string | undefined) {
	if (!token) return undefined
	const i = token.lastIndexOf('.')
	if (i < 1) return undefined
	const expected = Buffer.from(signSession(token.slice(0, i)))
	const got = Buffer.from(token)
	// Constant-time compare: a fast fail leaks how much of the mac was right.
	if (expected.length !== got.length || !timingSafeEqual(expected, got)) return undefined
	return token.slice(0, i)
}
