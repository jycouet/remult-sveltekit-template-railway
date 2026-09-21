// Delete me? Remove this file, Onboarding.svelte, and the <Onboarding /> line in AppShell.svelte.
import { Task } from '#modules/task/Task.ts'

import { remult, repo } from 'remult'

import { browser } from '$app/env'

export type Step = {
	id: string
	title: string
	hint: string
	href?: string
	external?: boolean
	/** Live truth. No check = a step you tick yourself. */
	check?: () => boolean | Promise<boolean>
}

/** Fields on Task when this project was generated. */
const TASK_FIELDS_AT_BIRTH = 6

const flagKey = (id: string) => `onboarding:${id}`
export const readFlag = (id: string) => browser && localStorage.getItem(flagKey(id)) === '1'
export const setFlag = (id: string, on = true) => {
	if (!browser) return
	if (on) localStorage.setItem(flagKey(id), '1')
	else localStorage.removeItem(flagKey(id))
}

export const steps: Step[] = [
	{
		id: 'create',
		title: 'Create a task',
		hint: 'Typed end to end. Validation lives on the entity and runs on both sides.',
		href: '/app',
		check: async () => (await repo(Task).count()) > 2,
	},
	{
		id: 'field',
		title: 'Add a field to Task',
		hint: 'src/modules/task/Task.ts - one line, and the API, the types and the admin follow.',
		check: () => repo(Task).metadata.fields.toArray().length > TASK_FIELDS_AT_BIRTH,
	},
	{
		id: 'login',
		title: 'Sign in - the first account is the admin',
		hint: 'Your email is the account. Add a member in the backstage, then try login-as.',
		href: '/login',
		check: () => remult.authenticated(),
	},
	{
		id: 'admin',
		title: 'Open the Admin UI',
		hint: 'A data browser generated from your entities, at /api/admin.',
		href: '/api/admin',
		external: true,
		check: () => readFlag('admin'),
	},
	{
		id: 'internal',
		title: 'Visit the backstage',
		hint: 'Users, cron runs, mails, SQL console - all yours to edit.',
		href: '/app/internal',
		check: () => readFlag('internal'),
	},
	{
		id: 'ai',
		title: 'Put your AI agent to work',
		hint: 'AGENTS.md + skills are in the repo. Try: "add a Project entity with tasks".',
	},
	{
		id: 'tests',
		title: 'Run the tests',
		hint: 'npm run test:unit - entity rules and the session signature, no server needed.',
	},
	{
		id: 'brag',
		title: 'Tell the world',
		hint: 'You are done. Post it, tag the people whose work you just deployed.',
		href:
			'https://bsky.app/intent/compose?text=Just%20shipped%20a%20full-stack%20app%20with%20%40remult.dev%20%2B%20%40svelte.dev%20on%20%40railway.com%20%F0%9F%9A%80',
		external: true,
		check: () => readFlag('brag'),
	},
]

class Onboarding {
	done = $state<Record<string, boolean>>({})
	open = $state(true)
	dismissed = $state(false)

	total = steps.length
	get completed() {
		return steps.filter((s) => this.done[s.id]).length
	}

	async refresh() {
		for (const step of steps) {
			// A manual step is owned by localStorage; a checked step is owned by the data.
			this.done[step.id] = step.check ? Boolean(await step.check()) : readFlag(step.id)
		}
	}

	tick(id: string, on: boolean) {
		setFlag(id, on)
		this.done[id] = on
	}

	/** Shrinks to a dot - never gone, so it can always come back. */
	setDismissed(on: boolean) {
		this.dismissed = on
		setFlag('dismissed', on)
	}
}

export const onboarding = new Onboarding()
