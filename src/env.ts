import { defineEnvVars } from '@sveltejs/kit/env'

// `schema: (v) => v` = optional: the app boots without it.
export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Postgres connection string. Unset = JSON files in ./db.',
		schema: (value) => value,
	},
	SUPER_ADMIN_EMAILS: {
		description: 'Comma-separated emails that always get every role. Put yours here.',
		schema: (value) => value,
	},
	AUTH_SECRET: {
		description: 'Signs the session cookie. Generate one: openssl rand -base64 32',
		schema: (value) => value,
	},
	REQUIRE_EMAIL_VERIFICATION: {
		description: "'true' to make people click a mailed link before their first sign-in.",
		schema: (value) => value === 'true',
	},
	SMTP_URL: {
		description: 'smtp://user:pass@host:587. Unset = an ethereal.email test inbox.',
		schema: (value) => value,
	},
})
