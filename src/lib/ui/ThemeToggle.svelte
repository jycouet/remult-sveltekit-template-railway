<script lang="ts">
	// The class is the source of truth: the boot script in app.html sets it before paint,
	// and CSS picks the icon - so there is nothing to hydrate and nothing to flash.
	const toggle = () => {
		const dark = document.documentElement.classList.toggle('dark')
		localStorage.setItem('theme', dark ? 'dark' : 'light')
	}
</script>

<button class="btn w-8 !px-0" aria-label="Toggle theme" onclick={toggle}>
	<span class="dark:hidden">☀</span>
	<span class="hidden dark:inline">☾</span>
</button>
