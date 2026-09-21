<script lang="ts">
	import { LastMails, WriteMail } from 'firstly/mail'
</script>

<h1 class="mb-1 text-xl font-semibold tracking-tight">Mails</h1>
<p class="text-muted-foreground mb-6 text-sm">
	Without SMTP credentials firstly falls back to an
	<a
		class="text-primary hover:underline"
		href="https://ethereal.email"
		target="_blank"
		rel="noreferrer">ethereal</a
	>
	test inbox, so nothing reaches a real person. Configure the transport in
	<code class="bg-muted rounded px-1">src/lib/server/api.ts</code>.
</p>

<div class="space-y-6">
	<WriteMail />
	<LastMails />
</div>
