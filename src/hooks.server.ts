import { sequence, type Handle } from '@sveltejs/kit/hooks'
import { getTextDirection } from '#lib/paraglide/runtime.js'
import { paraglideMiddleware } from '#lib/paraglide/server.js'
import { api } from '#lib/server/api.ts'
import { guard } from '#modules/auth/guard.server.ts'

import { handleCaching } from 'firstly/svelte/server'

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) =>
		resolve(
			{ ...event, request },
			{
				transformPageChunk: ({ html }) =>
					html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale)),
			},
		),
	)

// handleCaching: immutable assets cached forever, everything else never - deploy-safe.
export const handle = sequence(handleCaching, handleParaglide, api, guard)
