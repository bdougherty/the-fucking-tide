<script>
	import { page } from '$app/stores';
</script>

<h1>WTF?</h1>
<p>{$page.status} {$page.error ? $page.error.message : ''}</p>
<p><a href="/">Back to the fucking tide</a>.</p>
