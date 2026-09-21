import { entities } from '#lib/entities.ts'
import { getUser } from '#modules/auth/auth.server.ts'

import { remultApi } from 'remult/remult-sveltekit'
import { changeLog } from 'firstly/changeLog/server'
import { cron } from 'firstly/cron/server'
import { mail } from 'firstly/mail/server'
import { sqlAdmin } from 'firstly/sqlAdmin/server'

import { SMTP_URL } from '$app/env/private'

import { createDataProvider, usingPostgres } from './db.ts'
import { seed } from './seed.ts'

export const api = remultApi({
	entities,
	dataProvider: createDataProvider(),
	getUser,
	admin: true,
	// Seeding is idempotent: it only fills an empty database.
	initApi: seed,
	modules: [
		changeLog(),
		cron([
			{
				topic: 'heartbeat',
				cronTime: '*/5 * * * *',
				onTick: () => ({ at: new Date().toISOString() }),
			},
		]),
		// No SMTP_URL? firstly borrows an ethereal.email inbox - test mails still work,
		// they just never reach a real person. Every mail is stored either way.
		mail({ saveHtml: true, enableTest: true, nodemailer: { transport: SMTP_URL } }),
		// Raw SQL needs a real SQL database.
		...(usingPostgres ? [sqlAdmin({ path: '/internal/sql' })] : []),
	],
})
