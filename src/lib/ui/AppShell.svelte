<script lang="ts">
	import { m } from '#lib/paraglide/messages.js'
	import { site } from '#lib/site.ts'
	import { backToMe } from '#modules/auth/auth.remote.ts'
	import UserMenu from '#modules/auth/UserMenu.svelte'
	import type { Snippet } from 'svelte'

	import { remult } from 'remult'

	import { page } from '$app/state'

	import LocaleSwitch from './LocaleSwitch.svelte'
	import Onboarding from './Onboarding.svelte'
	import { setFlag } from './onboarding.svelte.ts'
	import ThemeToggle from './ThemeToggle.svelte'

	let { children }: { children: Snippet } = $props()

	const nav = [
		{ href: '/app', label: m.nav_tasks(), icon: '◧' },
		{ href: '/app/internal', label: m.nav_internal(), icon: '⚙' },
	]

	// Identity changed: reload so every query re-runs under the new user.
	const switchBack = async () => {
		await backToMe()
		location.reload()
	}

	const isActive = (href: string) =>
		href === '/app' ? page.url.pathname === '/app' : page.url.pathname.startsWith(href)
</script>

<div class="flex min-h-svh">
	<aside
		class="border-border bg-card/50 sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r p-4 md:flex"
	>
		<a href="/" class="mb-6 flex items-center gap-2 px-2">
			<img src="/favicon.svg" alt="" class="size-8 rounded-lg" />
			<span class="truncate text-sm leading-tight font-semibold">{site.name}</span>
		</a>

		<nav class="flex flex-col gap-1">
			{#each nav as item (item.href)}
				<a
					href={item.href}
					class="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition"
					class:bg-accent={isActive(item.href)}
					class:text-accent-foreground={isActive(item.href)}
					class:font-medium={isActive(item.href)}
				>
					<span class="opacity-60">{item.icon}</span>
					{item.label}
				</a>
			{/each}
			<a
				href="/api/admin"
				target="_blank"
				rel="noreferrer"
				onclick={() => setFlag('admin')}
				class="hover:bg-muted flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition"
			>
				<span class="opacity-60">▦</span>
				{m.nav_admin()}
				<span class="text-muted-foreground ml-auto text-xs">↗</span>
			</a>
		</nav>
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<header
			class="border-border bg-background/80 sticky top-0 z-20 flex h-14 items-center gap-3 border-b px-4 backdrop-blur"
		>
			<span class="text-muted-foreground truncate text-sm">{page.url.pathname}</span>
			<div class="ml-auto flex items-center gap-2">
				<LocaleSwitch />
				<ThemeToggle />
				<UserMenu />
			</div>
		</header>

		{#if remult.user?.impersonatorName}
			<div
				class="border-border bg-accent text-accent-foreground border-b px-4 py-1.5 text-center text-xs"
			>
				{m.impersonating({ name: remult.user?.name ?? '?' })} ·
				<button class="cursor-pointer font-medium underline" onclick={switchBack}>
					{m.back_to_real_user({ name: remult.user.impersonatorName })}
				</button>
			</div>
		{/if}

		<main class="mx-auto w-full max-w-4xl flex-1 p-4 pb-32 sm:p-8">
			{@render children()}
		</main>
	</div>
</div>

<Onboarding />
