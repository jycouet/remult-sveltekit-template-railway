import { entities } from '#lib/entities.ts'
import { usingPostgres } from '#lib/server/db.ts'

import { dev } from '$app/env'
import { query } from '$app/server'

export const serverFacts = query(async () => ({
	usingPostgres,
	runtime: {
		database: usingPostgres ? 'postgres' : 'json files · ./db',
		mode: dev ? 'development' : 'production',
		node: process.version,
		entities: entities.length,
	},
	modules: [
		{ name: 'changeLog', on: true, hint: 'every write recorded' },
		{ name: 'cron', on: true, hint: 'heartbeat every 5 min' },
		{ name: 'mail', on: true, hint: 'ethereal until you set SMTP_URL' },
		{
			name: 'sqlAdmin',
			on: usingPostgres,
			hint: usingPostgres ? 'read-only console' : 'needs DATABASE_URL',
		},
		{ name: 'admin', on: true, hint: '/api/admin' },
	],
}))
