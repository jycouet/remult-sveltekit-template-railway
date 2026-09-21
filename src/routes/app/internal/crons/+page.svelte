<script lang="ts">
	import { Cron } from 'firstly/cron'
	import { ff } from 'firstly/svelte'

	const runs = ff(Cron).many(() => ({ limit: 50 }), 'listen')

	const badge = (status: string) =>
		status === 'failed'
			? 'bg-destructive/15 text-destructive'
			: status === 'ended'
				? 'bg-success/15 text-success'
				: 'bg-muted text-muted-foreground'
</script>

<h1 class="mb-1 text-xl font-semibold tracking-tight">Crons</h1>
<p class="text-muted-foreground mb-6 text-sm">
	A <code class="bg-muted rounded px-1">heartbeat</code> job runs every 5 minutes (see
	<code class="bg-muted rounded px-1">src/lib/server/api.ts</code>). Every tick is stored, failures
	included.
</p>

<div class="card-app divide-border divide-y">
	{#each runs.items as run (run.id)}
		<div class="flex items-center gap-3 px-4 py-2.5 text-sm">
			<span class="font-medium">{run.topic}</span>
			<span class="rounded px-1.5 py-0.5 text-[10px] uppercase {badge(run.status)}">{run.status}</span>
			<span class="text-muted-foreground ml-auto text-xs">
				{run.startingAt?.toLocaleString()}
			</span>
		</div>
	{:else}
		<p class="text-muted-foreground px-4 py-10 text-center text-sm">
			No run yet - the first heartbeat lands within 5 minutes.
		</p>
	{/each}
</div>
