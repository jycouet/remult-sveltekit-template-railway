import { paraglideVitePlugin } from '@inlang/paraglide-js'
import adapter from '@sveltejs/adapter-node'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import type { KIT_ROUTES } from '#lib/ROUTES.ts'
import { defineConfig } from 'vitest/config'

import { firstly } from 'firstly/vite'

const PATH_SEPARATOR_RE = /[/\\]/

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			experimental: { remoteFunctions: true },
			compilerOptions: {
				experimental: { async: true },
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(PATH_SEPARATOR_RE).includes('node_modules') ? undefined : true,
			},
			adapter: adapter(),
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
		}),

		firstly<KIT_ROUTES>({
			stripper: {
				nullify: ['$app/env/private', '$env/static/private', '$env/dynamic/private'],
			},
		}),
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				},
			},
		],
	},
})
