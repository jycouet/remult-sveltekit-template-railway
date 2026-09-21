<script lang="ts">
	import { m } from '#lib/paraglide/messages.js'
	import SiteHead from '#lib/ui/SiteHead.svelte'
	import { isFirstAccount, signIn } from '#modules/auth/auth.remote.ts'

	import { page } from '$app/state'

	const redirectTo = $derived(page.url.searchParams.get('redirectTo') ?? '/app')
	const linkError = $derived(page.url.searchParams.get('error'))
</script>

<SiteHead title={m.login_title()} />

<div class="mx-auto max-w-md px-6 py-20">
	<h1 class="text-2xl font-semibold tracking-tight">{m.login_title()}</h1>

	{#if await isFirstAccount()}
		<p class="text-muted-foreground mt-1 mb-6 text-sm">
			Nobody here yet. <strong class="text-foreground">The first account becomes the admin</strong> - make
			it yours.
		</p>
	{:else}
		<p class="text-muted-foreground mt-1 mb-6 text-sm">
			No password: your email is the account. Unknown address? It is created on the spot.
		</p>
	{/if}

	{#if linkError}
		<p class="bg-destructive/10 text-destructive mb-4 rounded-lg px-3 py-2 text-sm">{linkError}</p>
	{/if}

	{#if signIn.result?.pending}
		<div class="card-app p-4 text-sm">
			<p class="font-medium">Check your inbox</p>
			<p class="text-muted-foreground mt-1">
				We sent a sign-in link to <strong class="text-foreground">{signIn.result.email}</strong>. It
				expires in 30 minutes.
			</p>
		</div>
	{:else}
		<form
			{...signIn.enhance(async (form) => {
				await form.submit()
				// Identity changed: a full load, so remult, the API rules and every query agree.
				if (signIn.result?.ok) location.assign(redirectTo)
			})}
			class="card-app flex flex-col gap-3 p-4"
		>
			<label class="text-sm font-medium" for="email">Email</label>
			<input
				id="email"
				class="input-app"
				autocomplete="email"
				placeholder="you@example.com"
				{...signIn.fields.email.as('email')}
			/>
			{#if signIn.result?.error}
				<p class="text-destructive text-sm">{signIn.result.error}</p>
			{/if}
			<button class="btn btn-primary self-start">{m.login_cta()}</button>
		</form>
	{/if}

	<p class="text-muted-foreground mt-4 text-xs">
		Sessions are a signed cookie, read by <code class="bg-muted rounded px-1">getUser()</code> on
		every request. Turn on <code class="bg-muted rounded px-1">REQUIRE_EMAIL_VERIFICATION</code> to make
		people click a mailed link first.
	</p>
</div>
