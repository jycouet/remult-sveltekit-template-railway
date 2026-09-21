<script lang="ts">
	import { site } from '#lib/site.ts'

	import { page } from '$app/state'

	// Kit's own messages ('Not Found', 'Internal Error') say less than our copy does.
	const BORING = ['Not Found', 'Internal Error', 'Forbidden']

	// Each status, explained as the line of code that produced it.
	const copy = $derived(
		{
			403: {
				title: 'Not your door',
				body: 'The server checked, and said no. That is the point: rules live on the entity.',
				code: `remult.isAllowed(Roles.admin)`,
				result: 'false',
			},
			404: {
				title: 'Nothing lives here',
				body: 'The link is wrong, or whatever was here is gone.',
				code: `repo(Route).findId('${page.url.pathname}')`,
				result: 'null',
			},
			500: {
				title: 'That one is on us',
				body: 'The server tripped on the way. Your logs know more than this page does.',
				code: 'await handler(event)',
				result: 'throw',
			},
		}[page.status] ?? {
			title: 'Unexpected',
			body: 'Something went sideways.',
			code: 'await handler(event)',
			result: String(page.status),
		},
	)
</script>

<svelte:head><title>{page.status} · {site.name}</title></svelte:head>

<div
	class="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
>
	<div class="deco aurora"></div>
	<div class="deco grid-fade"></div>

	<p class="status" aria-hidden="true">{page.status}</p>

	<h1 class="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{copy.title}</h1>
	<p class="text-muted-foreground mt-2 max-w-sm text-sm text-balance">{copy.body}</p>

	<div
		class="card-app mt-6 w-full max-w-md overflow-hidden text-left font-mono text-xs backdrop-blur"
	>
		<div class="border-border flex items-center gap-1.5 border-b px-3 py-2">
			<span class="bg-destructive/60 size-2 rounded-full"></span>
			<span class="bg-muted-foreground/40 size-2 rounded-full"></span>
			<span class="bg-success/60 size-2 rounded-full"></span>
		</div>
		<div class="space-y-1 px-3 py-3">
			<p class="truncate">
				<span class="text-muted-foreground mr-1.5 select-none">&gt;</span>{copy.code}
			</p>
			<p class="text-destructive">{copy.result}</p>
			{#if page.error?.message && !BORING.includes(page.error.message)}
				<p class="text-muted-foreground pt-1">// {page.error.message}</p>
			{/if}
		</div>
	</div>

	<div class="mt-8 flex flex-wrap items-center justify-center gap-2">
		{#if page.status === 403}
			<a class="btn btn-primary" href="/login?redirectTo={page.url.pathname}"
				>Sign in as someone else</a
			>
		{:else}
			<a class="btn btn-primary" href="/app">Back to the app</a>
		{/if}
		<a class="btn" href="/">Home</a>
	</div>
</div>

<style>
	.deco {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.aurora {
		background:
			radial-gradient(
				50rem 26rem at 50% -10%,
				oklch(from var(--primary) l c h / 0.25),
				transparent 60%
			),
			radial-gradient(
				40rem 22rem at 80% 100%,
				oklch(from var(--primary) l c calc(h + 60) / 0.16),
				transparent 55%
			);
	}
	.grid-fade {
		background-image:
			linear-gradient(to right, var(--border) 1px, transparent 1px),
			linear-gradient(to bottom, var(--border) 1px, transparent 1px);
		background-size: 3rem 3rem;
		mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%);
		opacity: 0.45;
	}
	.status {
		font-size: clamp(6rem, 18vw, 10rem);
		font-weight: 800;
		line-height: 0.85;
		letter-spacing: -0.05em;
		font-variant-numeric: tabular-nums;
		background: linear-gradient(
			170deg,
			var(--foreground) 15%,
			oklch(from var(--primary) l c h / 0.3) 95%
		);
		background-clip: text;
		color: transparent;
	}
</style>
