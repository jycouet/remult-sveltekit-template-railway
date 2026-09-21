<script lang="ts">
	import { page } from '$app/state'

	let { children } = $props()

	const tabs = [
		{ href: '/app/internal', label: 'Overview' },
		{ href: '/app/internal/users', label: 'Users' },
		{ href: '/app/internal/crons', label: 'Crons' },
		{ href: '/app/internal/mails', label: 'Mails' },
		{ href: '/app/internal/sql', label: 'SQL' },
	]
</script>

<nav class="border-border mb-6 flex gap-1 border-b">
	{#each tabs as tab (tab.href)}
		<a
			href={tab.href}
			class="-mb-px border-b-2 px-3 py-2 text-sm transition"
			class:border-primary={page.url.pathname === tab.href}
			class:font-medium={page.url.pathname === tab.href}
			class:border-transparent={page.url.pathname !== tab.href}
			class:text-muted-foreground={page.url.pathname !== tab.href}
		>
			{tab.label}
		</a>
	{/each}
</nav>

{@render children()}
