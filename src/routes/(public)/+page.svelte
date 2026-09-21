<script lang="ts">
	import { m } from '#lib/paraglide/messages.js'
	import { site } from '#lib/site.ts'
	import SiteHead from '#lib/ui/SiteHead.svelte'

	// Edit the copy in messages/*.json, the identity in src/lib/site.ts,
	// and the colours in the :root block of your stylesheet. That is the whole theme.
	const points = [
		{ icon: '◆', title: 'One class, one table', body: m.landing_point_entities() },
		{ icon: '◇', title: 'Live by default', body: m.landing_point_live() },
		{ icon: '◈', title: 'Rules on the server', body: m.landing_point_rules() },
	]

	const entitySnippet = `@FF_Entity<Task>('tasks', {
  allowApiRead: true,
  allowApiInsert: Allow.authenticated,
  allowApiDelete: Roles.admin,
})
export class Task {
  @Fields.id() id!: string
  @Fields.string() title = ''
  @Fields.boolean() completed = false
}`

	const shipped = [
		'REST API at /api',
		'TypeScript types, shared',
		'Validation, both sides',
		'Admin UI at /api/admin',
		'Live queries over SSE',
	].filter(Boolean)
</script>

<SiteHead />

<section class="relative isolate overflow-hidden">
	<div class="deco aurora"></div>
	<div class="deco grid-fade"></div>

	<div class="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-20 text-center">
		<span
			class="border-border bg-card/60 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur"
		>
			<span class="bg-success size-1.5 animate-pulse rounded-full"></span>
			remult + firstly + SvelteKit
		</span>

		<h1
			class="brand-ink text-6xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-7xl"
		>
			{site.name}
		</h1>
		<p class="text-muted-foreground mt-5 max-w-xl text-lg text-balance">{site.tagline}</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a class="btn btn-primary shadow-primary/20 h-10 px-5 shadow-lg" href="/app">
				{m.landing_cta()}
				<span aria-hidden="true">→</span>
			</a>
			<a class="btn h-10 px-5" href="https://remult.dev/docs" target="_blank" rel="noreferrer">
				{m.landing_docs()}
			</a>
		</div>
	</div>
</section>

<section class="mx-auto grid max-w-5xl gap-8 px-6 pb-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
	<div class="card-app overflow-hidden">
		<div class="border-border flex items-center gap-1.5 border-b px-4 py-2.5">
			<span class="bg-destructive/60 size-2.5 rounded-full"></span>
			<span class="bg-muted-foreground/40 size-2.5 rounded-full"></span>
			<span class="bg-success/60 size-2.5 rounded-full"></span>
			<span class="text-muted-foreground ml-2 font-mono text-xs">src/modules/task/Task.ts</span>
		</div>
		<pre class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed"><code>{entitySnippet}</code
			></pre>
	</div>

	<div>
		<h2 class="text-2xl font-semibold tracking-tight">Write the model. Get the app.</h2>
		<p class="text-muted-foreground mt-2 text-sm">
			That file is the contract. Everything below is generated from it - nothing to wire, nothing to
			keep in sync.
		</p>
		<ul class="mt-5 space-y-2 text-sm">
			{#each shipped as item (item)}
				<li class="flex items-center gap-2.5">
					<span
						class="bg-success/15 text-success grid size-5 shrink-0 place-items-center rounded-full text-[10px]"
						>✓</span
					>
					{item}
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-3">
	{#each points as point (point.title)}
		<article class="card-app group p-5 transition hover:-translate-y-0.5 hover:shadow-md">
			<span
				class="bg-accent text-accent-foreground grid size-9 place-items-center rounded-lg transition group-hover:scale-105"
			>
				{point.icon}
			</span>
			<h3 class="mt-3 text-sm font-semibold">{point.title}</h3>
			<p class="text-muted-foreground mt-1 text-sm leading-snug">{point.body}</p>
		</article>
	{/each}
</section>

<footer class="border-border border-t">
	<div
		class="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-6 text-xs"
	>
		<span>{site.name}</span>
		<a class="hover:text-foreground" href="https://remult.dev/docs" target="_blank" rel="noreferrer"
			>remult</a
		>
		<a class="hover:text-foreground" href="https://firstly.fun" target="_blank" rel="noreferrer"
			>firstly</a
		>
		<a
			class="hover:text-foreground"
			href="https://svelte.dev/docs/kit"
			target="_blank"
			rel="noreferrer">sveltekit</a
		>
		<a
			class="hover:text-foreground ml-auto"
			href="https://github.com/remult/remult"
			target="_blank"
			rel="noreferrer"
		>
			⭐ star remult
		</a>
	</div>
</footer>

<style>
	/* Decoration lives with the page it decorates - delete this block and nothing else breaks. */
	.deco {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.aurora {
		background:
			radial-gradient(
				60rem 30rem at 15% -10%,
				oklch(from var(--primary) l c h / 0.22),
				transparent 60%
			),
			radial-gradient(
				45rem 25rem at 90% 0%,
				oklch(from var(--primary) l c calc(h + 60) / 0.18),
				transparent 55%
			);
	}
	.grid-fade {
		background-image:
			linear-gradient(to right, var(--border) 1px, transparent 1px),
			linear-gradient(to bottom, var(--border) 1px, transparent 1px);
		background-size: 3rem 3rem;
		mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%);
		opacity: 0.5;
	}
	.brand-ink {
		background: linear-gradient(
			100deg,
			var(--foreground) 10%,
			var(--primary) 55%,
			oklch(from var(--primary) l c calc(h + 40)) 100%
		);
		background-clip: text;
		color: transparent;
	}
</style>
