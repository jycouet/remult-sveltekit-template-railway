import { defineRailway, postgres, preserve, project, service } from 'railway/iac'

export default defineRailway(() => {
	const db = postgres('Postgres')

	const web = service('SvelteKit', {
		build: 'pnpm run build',
		// gzip everything but remult's SSE endpoint, which must stay unbuffered
		start: 'node scripts/prod-server.js',
		// A generated *.up.railway.app domain is the one thing IaC cannot mint for you:
		// `domains` here means custom domains. Set the target port in the template (or click
		// "Generate Domain" once) and Railway routes to PORT below.
		env: {
			PORT: '3000',
			DATABASE_URL: db.env.DATABASE_URL,
			// adapter-node needs ORIGIN to trust Railway's proxy
			ORIGIN: 'https://${{RAILWAY_PUBLIC_DOMAIN}}',
			// set once in Railway, never committed
			AUTH_SECRET: preserve(),
			SUPER_ADMIN_EMAILS: preserve(),
		},
		deploy: {
			healthcheckPath: '/',
			sleepApplication: true,
		},
	})

	return project('Remult SvelteKit', {
		resources: [web, db],
	})
})
