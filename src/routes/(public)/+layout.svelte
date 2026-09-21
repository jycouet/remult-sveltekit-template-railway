<script lang="ts">
	import PublicHeader from '#lib/ui/PublicHeader.svelte'

	let { children } = $props()
</script>

<PublicHeader />

{@render children()}
