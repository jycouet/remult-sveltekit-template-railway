<script lang="ts">
	import { addMember, loginAs } from '#modules/auth/auth.remote.ts'
	import { User } from '#modules/auth/User.ts'

	import { ff, toast } from 'firstly/svelte'

	const users = ff(User).many(() => ({}), 'listen')

	let email = $state('')

	const add = async (e: SubmitEvent) => {
		e.preventDefault()
		try {
			await addMember(email)
			email = ''
		} catch (err) {
			toast.fromError(err)
		}
	}

	// Identity changed: reload so every query re-runs under the new user.
	const become = async (id: string) => {
		await loginAs(id)
		location.reload()
	}
</script>

<h1 class="mb-1 text-xl font-semibold tracking-tight">Users</h1>
<p class="text-muted-foreground mb-4 text-sm">
	The people your API rules talk about. One click to see the app through their eyes.
</p>

<form class="mb-4 flex gap-2" onsubmit={add}>
	<input class="input-app" type="email" placeholder="teammate@example.com" bind:value={email} />
	<button class="btn whitespace-nowrap">Add member</button>
</form>

<div class="card-app divide-border divide-y">
	{#each users.items as user (user.id)}
		<div class="flex items-center gap-3 px-4 py-3 text-sm">
			<span
				class="bg-accent text-accent-foreground grid size-8 place-items-center rounded-full text-xs font-medium"
			>
				{user.name.slice(0, 1).toUpperCase()}
			</span>
			<span class="min-w-0 flex-1">
				<span class="block truncate font-medium">{user.name}</span>
				<span class="text-muted-foreground block truncate text-xs">{user.email}</span>
			</span>
			<span
				class="text-muted-foreground hidden text-xs sm:block"
				title={user.roles.join(', ') || 'no role'}
			>
				{user.roles.includes('admin') ? 'admin' : 'member'}
			</span>
			<button class="btn" onclick={() => become(user.id)}>login as</button>
		</div>
	{/each}
</div>
