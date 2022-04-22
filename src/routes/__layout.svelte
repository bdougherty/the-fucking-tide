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

<style>
	footer {
		position: fixed;
		inset-block-end: 0;
		inset-inline-end: 0;
	}

	footer p {
		padding: 0.5rem 0.75rem;
		margin: 0;
		font-size: 0.75rem;
	}
</style>
