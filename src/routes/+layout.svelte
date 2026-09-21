<script lang="ts">
	import { me } from '#modules/auth/auth.remote.ts'

	import { remult } from 'remult'
	import {
		stackHttpClient,
		stackSubscriptionClient,
		withShortTermCache,
		withTabSharing,
	} from 'firstly'
	import { FF_DialogManager, FF_ToastManager, initRemultSvelteReactivity } from 'firstly/svelte'

	import './layout.css'

	let { children } = $props()

	// Runes-aware remult: remult.user and every entity instance become reactive.
	initRemultSvelteReactivity()
	// One shared SSE connection for all tabs + a 2s read cache.
	remult.apiClient.httpClient = stackHttpClient(withShortTermCache())
	remult.apiClient.subscriptionClient = stackSubscriptionClient(withTabSharing())

	// Fills remult.user on both sides - SSR resolves it in-process, the browser inherits
	// the serialized value - and remult.user is reactive, so the whole UI follows.
	remult.user = (await me()) ?? undefined
</script>

<FF_ToastManager />
<FF_DialogManager />

{@render children()}
