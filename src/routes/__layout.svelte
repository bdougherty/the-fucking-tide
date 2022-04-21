<script>
	import '../app.css';
	import { page } from '$app/stores';
</script>

<slot />

<footer>
	<p>
		{#if $page.url.pathname !== '/about'}
			<a href="/about">About</a>.
		{/if}
		A <a href="https://secretspaceagency.com">Secret Space Agency</a> program.
	</p>
</footer>
