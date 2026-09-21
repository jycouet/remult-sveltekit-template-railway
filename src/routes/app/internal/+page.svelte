<script lang="ts">
	import { serverFacts } from '#lib/facts.remote.ts'
	import { User } from '#modules/auth/User.ts'
	import { Task } from '#modules/task/Task.ts'

	import { remult, repo } from 'remult'
	import { Cron } from 'firstly/cron'

	// Resolved during SSR and serialized into the page - no client round trip.
	const facts = await serverFacts()

	const links = [
		{ label: 'remult', docs: 'https://remult.dev/docs', repo: 'https://github.com/remult/remult' },
		{ label: 'firstly', docs: 'https://firstly.fun', repo: 'https://github.com/jycouet/firstly' },
		{
			label: 'sveltekit',
			docs: 'https://svelte.dev/docs/kit',
			repo: 'https://github.com/sveltejs/kit',
		},
	]
</script>

<h1 class="mb-1 text-xl font-semibold tracking-tight">Backstage</h1>
<p class="text-muted-foreground mb-6 text-sm">What this server is made of, right now.</p>

<div class="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
	<a
		class="card-app group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
		href="/app"
	>
		<span class="bg-accent text-accent-foreground grid size-9 place-items-center rounded-lg">◆</span>
		<span>
			<span class="block text-2xl leading-none font-semibold tabular-nums"
				>{await repo(Task).count()}</span
			>
			<span class="text-muted-foreground block text-xs">tasks</span>
		</span>
	</a>
	<a
		class="card-app group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
		href="/app/internal/users"
	>
		<span class="bg-accent text-accent-foreground grid size-9 place-items-center rounded-lg">●</span>
		<span>
			<span class="block text-2xl leading-none font-semibold tabular-nums"
				>{await repo(User).count()}</span
			>
			<span class="text-muted-foreground block text-xs">users</span>
		</span>
	</a>
	<a
		class="card-app group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
		href="/app/internal/crons"
	>
		<span class="bg-accent text-accent-foreground grid size-9 place-items-center rounded-lg">◴</span>
		<span>
			<span class="block text-2xl leading-none font-semibold tabular-nums"
				>{await repo(Cron).count()}</span
			>
			<span class="text-muted-foreground block text-xs">cron runs</span>
		</span>
	</a>
	<a
		class="card-app group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
		href="/api/admin"
	>
		<span class="bg-accent text-accent-foreground grid size-9 place-items-center rounded-lg">▦</span>
		<span>
			<span class="block text-2xl leading-none font-semibold tabular-nums"
				>{facts.runtime.entities}</span
			>
			<span class="text-muted-foreground block text-xs">entities</span>
		</span>
	</a>
</div>

<div class="grid gap-4 lg:grid-cols-2">
	<section class="card-app p-4">
		<h2 class="text-muted-foreground mb-3 text-xs tracking-wide uppercase">Runtime</h2>
		<dl class="space-y-2 text-sm">
			{#each Object.entries(facts.runtime) as [key, value] (key)}
				<div class="flex items-baseline justify-between gap-4">
					<dt class="text-muted-foreground">{key}</dt>
					<dd class="truncate font-mono text-xs">{value}</dd>
				</div>
			{/each}
			<div class="flex items-baseline justify-between gap-4">
				<dt class="text-muted-foreground">signed in as</dt>
				<dd class="truncate font-mono text-xs">{remult.user?.name ?? 'anonymous'}</dd>
			</div>
		</dl>
	</section>

	<section class="card-app p-4">
		<h2 class="text-muted-foreground mb-3 text-xs tracking-wide uppercase">Modules</h2>
		<ul class="space-y-2 text-sm">
			{#each facts.modules as mod (mod.name)}
				<li class="flex items-center gap-2.5">
					<span
						class="size-1.5 rounded-full"
						class:bg-success={mod.on}
						class:bg-muted-foreground={!mod.on}
					></span>
					<span class="font-medium">{mod.name}</span>
					<span class="text-muted-foreground ml-auto text-xs">{mod.hint}</span>
				</li>
			{/each}
		</ul>
	</section>
</div>

<div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
	{#each links as link (link.label)}
		<a
			class="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-full border px-2.5 py-1 transition"
			href={link.docs}
			target="_blank"
			rel="noreferrer"
		>
			{link.label} docs
		</a>
		<a
			class="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-full border px-2.5 py-1 transition"
			href={link.repo}
			target="_blank"
			rel="noreferrer"
		>
			⭐ {link.label}
		</a>
	{/each}
</div>
