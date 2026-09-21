<script lang="ts">
	import { site } from '#lib/site.ts'

	import { remult } from 'remult'

	import LocaleSwitch from './LocaleSwitch.svelte'
	import ThemeToggle from './ThemeToggle.svelte'
</script>

<header class="flex h-14 items-center gap-3 px-4 sm:px-8">
	<a class="flex items-center gap-2 font-semibold" href="/">
		<img src="/favicon.svg" alt="" class="size-6 rounded" />
		{site.name}
	</a>
	<div class="ml-auto flex items-center gap-2">
		<LocaleSwitch />
		<ThemeToggle />
		<a class="btn" href={remult.authenticated() ? '/app' : '/login'}>
			{remult.user?.name ?? 'Sign in'}
		</a>
	</div>
</header>
