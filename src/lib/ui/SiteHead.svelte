<script lang="ts">
	import { site } from '#lib/site.ts'

	import { page } from '$app/state'

	let { title, description = site.description }: { title?: string; description?: string } = $props()

	const full = $derived(title ? `${title} · ${site.name}` : `${site.name} · ${site.tagline}`)
	const image = $derived(new URL(site.ogImage, page.url.origin).href)
</script>

<svelte:head>
	<title>{full}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={full} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.href} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
