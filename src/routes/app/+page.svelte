<script lang="ts">
	import { m } from '#lib/paraglide/messages.js'
	import SiteHead from '#lib/ui/SiteHead.svelte'
	import { PRIORITIES, Task } from '#modules/task/Task.ts'

	import { ff, toast } from 'firstly/svelte'

	let hideCompleted = $state(false)

	// 'listen' = liveQuery: the list follows the database, in every tab.
	const tasks = ff(Task).many(() => ({ where: hideCompleted ? { completed: false } : {} }), 'listen')

	// The entity knows what the current user may do - ask it, never guess in the markup.
	const meta = $derived(tasks.meta)

	let title = $state('')

	const add = async (e: SubmitEvent) => {
		e.preventDefault()
		tasks.create({ title })
		try {
			await tasks.save()
			title = ''
		} catch {
			// tasks.error holds the validation message, shown under the input.
		}
	}

	const toggle = async (task: Task) => {
		task.completed = !task.completed
		await tasks.save(task).catch(toast.fromError)
	}

	const setPriority = async (task: Task, priority: Task['priority']) => {
		task.priority = priority
		await tasks.save(task).catch(toast.fromError)
	}
</script>

<SiteHead title={m.nav_tasks()} />

<header class="mb-6">
	<h1 class="text-2xl font-semibold tracking-tight">{m.nav_tasks()}</h1>
	<p class="text-muted-foreground text-sm">
		One entity, zero API code. Live over SSE, validated on both sides, permissions enforced
		server-side.
	</p>
</header>

<form class="mb-4 flex gap-2" onsubmit={add}>
	<input
		class="input-app"
		bind:value={title}
		disabled={!meta.apiInsertAllowed()}
		placeholder={meta.apiInsertAllowed() ? 'What needs to be done?' : 'Sign in to add a task'}
	/>
	<button class="btn btn-primary" disabled={tasks.isWriting || !meta.apiInsertAllowed()}>Add</button>
</form>

{#if tasks.error}
	<p class="bg-destructive/10 text-destructive mb-4 rounded-lg px-3 py-2 text-sm">{tasks.error}</p>
{/if}

<div class="text-muted-foreground mb-2 flex items-center gap-3 text-xs">
	<label class="flex cursor-pointer items-center gap-1.5">
		<input type="checkbox" class="size-3.5 accent-[var(--primary)]" bind:checked={hideCompleted} />
		hide completed
	</label>
	<span class="ml-auto">{tasks.items.length} shown{tasks.loading.fetching ? ' · syncing' : ''}</span>
</div>

<div class="card-app divide-border divide-y">
	{#each tasks.items as task (task.id)}
		{@const canUpdate = meta.apiUpdateAllowed(task)}
		{@const canDelete = meta.apiDeleteAllowed(task)}
		<div class="group flex items-center gap-3 px-4 py-2.5">
			<input
				type="checkbox"
				class="size-4 accent-[var(--primary)] disabled:opacity-40"
				checked={task.completed}
				disabled={!canUpdate}
				onchange={() => toggle(task)}
				aria-label="Toggle {task.title}"
			/>
			<span
				class="min-w-0 flex-1 truncate text-sm"
				class:line-through={task.completed}
				class:text-muted-foreground={task.completed}
			>
				{task.title}
			</span>
			<select
				class="border-border bg-background rounded-md border px-1.5 py-1 text-xs disabled:opacity-40"
				value={task.priority}
				disabled={!canUpdate}
				onchange={(e) => setPriority(task, e.currentTarget.value as Task['priority'])}
			>
				{#each PRIORITIES as p (p)}
					<option value={p}>{p}</option>
				{/each}
			</select>
			<button
				class="rounded-md px-2 py-1 text-xs transition group-hover:opacity-100 sm:opacity-0 {canDelete
					? 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer'
					: 'text-muted-foreground/40 cursor-not-allowed'}"
				disabled={!canDelete}
				title={canDelete ? 'Delete' : 'Admins only - the entity says so'}
				onclick={() => tasks.confirmRemove(task)}
			>
				delete
			</button>
		</div>
	{:else}
		<p class="text-muted-foreground px-4 py-10 text-center text-sm">Nothing here yet.</p>
	{/each}
</div>

<p class="text-muted-foreground mt-4 text-xs">
	Buttons follow <code class="bg-muted rounded px-1">meta.apiDeleteAllowed(task)</code> - the same rules
	the server enforces, read off the entity. Admins can delete; members cannot.
</p>
