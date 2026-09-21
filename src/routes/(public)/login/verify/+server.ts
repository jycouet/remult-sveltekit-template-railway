import { redirect } from '@sveltejs/kit'
import { verifySignInLink } from '#modules/auth/auth.server.ts'

export const GET = async (event) => {
	const result = await verifySignInLink(event, event.url.searchParams.get('token') ?? '')
	if ('error' in result) redirect(303, `/login?error=${encodeURIComponent(result.error ?? '')}`)
	redirect(303, '/app')
}
