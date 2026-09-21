<script lang="ts">
	import { serverFacts } from '#lib/facts.remote.ts'
</script>

<h1 class="mb-1 text-xl font-semibold tracking-tight">SQL</h1>

{#if (await serverFacts()).usingPostgres}
	<p class="text-muted-foreground mb-6 text-sm">
		Read-only by default (every query runs in a <code class="bg-muted rounded px-1"
			>BEGIN READ ONLY</code
		>
		transaction). Results are logged to the browser console too, so an AI agent can read them.
	</p>
	{#await import('firstly/sqlAdmin') then { SqlAdmin }}
		<SqlAdmin />
	{/await}
{:else}
	<p class="card-app text-muted-foreground p-4 text-sm">
		You are on JSON files. Start postgres with <code class="bg-muted rounded px-1"
			>docker compose up -d</code
		>, set <code class="bg-muted rounded px-1">DATABASE_URL</code> in
		<code class="bg-muted rounded px-1">.env</code>, restart - and this console lights up.
	</p>
{/if}
