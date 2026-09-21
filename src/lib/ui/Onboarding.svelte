<!--
  The getting-started panel. To drop it for good: delete this file and
  onboarding.svelte.ts, then remove <Onboarding /> from AppShell.svelte.
-->
<script lang="ts">
	import { page } from '$app/state'

	import { onboarding, readFlag, setFlag, steps } from './onboarding.svelte.ts'

	let mounted = $state(false)

	$effect(() => {
		mounted = true
		onboarding.dismissed = readFlag('dismissed')
		// Gone for good? Delete this file, onboarding.svelte.ts, and <Onboarding /> in AppShell.svelte.
		onboarding.open = localStorage.getItem('onboarding:open') !== '0'
	})

	// Re-check on every navigation, and keep checking while the panel is open.
	$effect(() => {
		if (page.url.pathname.startsWith('/app/internal')) setFlag('internal')
		void onboarding.refresh()
	})

	$effect(() => {
		if (!onboarding.open || onboarding.dismissed) return
		const id = setInterval(() => void onboarding.refresh(), 2000)
		return () => clearInterval(id)
	})

	const toggle = () => {
		onboarding.open = !onboarding.open
		localStorage.setItem('onboarding:open', onboarding.open ? '1' : '0')
	}

	let pct = $derived(Math.round((onboarding.completed / onboarding.total) * 100))
</script>

{#snippet ring(size: string)}
	<svg viewBox="0 0 36 36" class="{size} -rotate-90">
		<circle
			cx="18"
			cy="18"
			r="15"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			class="text-muted"
		/>
		<circle
			cx="18"
			cy="18"
			r="15"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			class="text-primary transition-[stroke-dasharray] duration-500"
			stroke-dasharray="{(pct / 100) * 94.2} 94.2"
		/>
	</svg>
{/snippet}

{#if mounted && onboarding.dismissed}
	<button
		class="card-app fixed right-4 bottom-4 z-40 grid size-11 cursor-pointer place-items-center shadow-lg transition hover:scale-105"
		title="Getting started ({onboarding.completed}/{onboarding.total})"
		onclick={() => onboarding.setDismissed(false)}
	>
		{@render ring('size-9')}
		<span class="absolute text-[10px] font-semibold tabular-nums">{pct}%</span>
	</button>
{/if}

{#if mounted && !onboarding.dismissed}
	<div class="fixed right-4 bottom-4 z-40 w-[min(21rem,calc(100vw-2rem))]">
		<div class="card-app overflow-hidden shadow-lg">
			<div class="flex items-center gap-3 px-4 py-3">
				<button
					class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
					onclick={toggle}
				>
					<span class="relative grid size-9 shrink-0 place-items-center">
						{@render ring('size-9')}
						<span class="absolute text-[10px] font-semibold tabular-nums">{pct}%</span>
					</span>
					<span class="min-w-0 flex-1">
						<span class="block text-sm font-semibold">Getting started</span>
						<span class="text-muted-foreground block text-xs">
							{onboarding.completed}/{onboarding.total} done · checked live
						</span>
					</span>
				</button>
				<button
					class="text-muted-foreground hover:bg-muted cursor-pointer rounded-md px-1.5 py-1 text-xs"
					title="Minimise - click the dot to bring it back"
					onclick={() => onboarding.setDismissed(true)}
				>
					✕
				</button>
			</div>

			{#if onboarding.open}
				<ul class="border-border max-h-[50svh] overflow-auto border-t">
					{#each steps as step (step.id)}
						{@const done = onboarding.done[step.id]}
						<li
							class="group border-border/60 flex items-start gap-3 border-b px-4 py-2.5 last:border-b-0"
						>
							<button
								class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border text-[11px] transition"
								class:border-transparent={done}
								class:bg-success={done}
								class:text-white={done}
								class:border-border={!done}
								class:cursor-pointer={!step.check}
								class:cursor-default={!!step.check}
								disabled={!!step.check}
								title={step.check ? 'Checked automatically' : 'Tick me when done'}
								onclick={() => onboarding.tick(step.id, !done)}
							>
								{done ? '✓' : ''}
							</button>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<span class="text-sm" class:line-through={done} class:text-muted-foreground={done}>
										{step.title}
									</span>
									{#if step.href}
										<a
											href={step.href}
											target={step.external ? '_blank' : undefined}
											rel={step.external ? 'noreferrer' : undefined}
											onclick={() => step.external && setFlag(step.id)}
											class="text-primary ml-auto shrink-0 text-xs opacity-0 transition group-hover:opacity-100 hover:underline"
										>
											open ↗
										</a>
									{/if}
								</div>
								<p class="text-muted-foreground text-xs leading-snug">{step.hint}</p>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}
