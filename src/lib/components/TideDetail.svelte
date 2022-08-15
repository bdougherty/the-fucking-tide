<script>
	/** @type {import('src/app').TidePrediction} */
	export let nextTide;

	/** @type {import('src/app').TideStation} */
	export let tideStation;

	const dateFormatter = new Intl.DateTimeFormat('default', {
		timeStyle: 'short'
	});
</script>

<p>
	{#if nextTide.type.toLowerCase() === 'high'}
		High
	{:else}
		Low
	{/if}
	tide is
	<time datetime={nextTide.time}>{dateFormatter.format(new Date(nextTide.time))}</time>
	at {tideStation.name}.
</p>

<style>
	p {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0.25rem 0 0;
		max-width: none;
	}
</style>
