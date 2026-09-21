<script lang="ts">
	import { getLocale, locales, setLocale } from '#lib/paraglide/runtime.js'
</script>

<div class="border-border flex h-8 items-center gap-0.5 rounded-lg border px-0.5 text-xs">
	{#each locales as locale (locale)}
		<button
			class="h-6 cursor-pointer rounded-md px-1.5 uppercase transition"
			class:bg-accent={getLocale() === locale}
			class:text-accent-foreground={getLocale() === locale}
			class:text-muted-foreground={getLocale() !== locale}
			onclick={() => setLocale(locale)}
		>
			{locale}
		</button>
	{/each}
</div>
