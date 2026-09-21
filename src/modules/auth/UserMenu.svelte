<script lang="ts">
	import { m } from '#lib/paraglide/messages.js'
	import { backToMe, impersonationTargets, loginAs, signOut } from '#modules/auth/auth.remote.ts'

	import { remult } from 'remult'

	let open = $state(false)

	// Admin-only on the server: a member receives an empty list.
	const users = await impersonationTargets()

	// Identity changed: reload so every query re-runs under the new user.
	const switchTo = async (fn: () => Promise<unknown>) => {
		localStorage.setItem('onboarding:loginAs', '1')
		await fn()
		location.reload()
	}
</script>

<div class="relative">
	<button class="btn" onclick={() => (open = !open)}>
		{#if remult.authenticated()}
			<span
				class="bg-primary text-primary-foreground grid size-5 place-items-center rounded-full text-[10px]"
			>
				{(remult.user?.name ?? '?').slice(0, 1)}
			</span>
			{remult.user?.name}
			{#if remult.isAllowed('admin')}
				<span class="bg-accent text-accent-foreground rounded px-1.5 py-0.5 text-[10px]">admin</span>
			{/if}
		{:else}
			Anonymous
		{/if}
		<span class="opacity-50">▾</span>
	</button>

	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-30" onclick={() => (open = false)} onkeydown={() => {}}></div>
		<div class="card-app absolute right-0 z-40 mt-2 w-64 overflow-hidden p-1 text-sm">
			{#if remult.user?.impersonatorName}
				<button
					class="bg-accent text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left font-medium"
					onclick={() => switchTo(backToMe)}
				>
					↩ {m.back_to_real_user({ name: remult.user.impersonatorName })}
				</button>
				<div class="border-border my-1 border-t"></div>
			{/if}

			{#if users.length}
				<p class="text-muted-foreground px-3 py-2 text-xs tracking-wide uppercase">{m.login_as()}</p>
				{#each users as u (u.id)}
					<button
						class="hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left"
						onclick={() => switchTo(() => loginAs(u.id))}
					>
						<span class="bg-muted grid size-6 place-items-center rounded-full text-[11px]">
							{u.name.slice(0, 1)}
						</span>
						<span class="min-w-0 flex-1">
							<span class="block truncate">{u.name}</span>
							<span class="text-muted-foreground block truncate text-xs">{u.email}</span>
						</span>
					</button>
				{/each}
				<div class="border-border my-1 border-t"></div>
			{/if}

			<button
				class="hover:bg-muted w-full cursor-pointer rounded-md px-3 py-2 text-left"
				onclick={() => switchTo(signOut)}
			>
				{m.sign_out()}
			</button>
		</div>
	{/if}
</div>
