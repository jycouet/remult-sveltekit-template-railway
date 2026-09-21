import { createPostgresDataProvider } from 'remult/postgres'
import { JsonFileDataProvider } from 'remult/server'

import { building } from '$app/env'
import { DATABASE_URL } from '$app/env/private'

/** Postgres as soon as DATABASE_URL is set, JSON files in ./db otherwise. */
export const usingPostgres = Boolean(DATABASE_URL)

export function createDataProvider() {
	if (building) return undefined
	if (usingPostgres) return createPostgresDataProvider({ connectionString: DATABASE_URL })
	return new JsonFileDataProvider('./db')
}
