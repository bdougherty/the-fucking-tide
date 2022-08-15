<script>
	import { getHighTideEmoji } from '$lib/tides';

	/** @type {import('src/app').TidePrediction} */
	export let nextTide;

	/** @type {number} */
	export let progress;

	$: rising = nextTide.type.toLowerCase() === 'high';
</script>

<h1>
	{#if rising}
		{#if progress < 0.3}
			Ugh, it’s fucking low tide. 😫
		{:else if progress < 0.6}
			The tide’s still pretty fucking low. 😞
		{:else if progress < 0.7}
			It’s almost fucking high tide. 🙌
		{:else}
			It’s fucking high tide. {getHighTideEmoji()}
		{/if}
	{:else if progress < 0.3}
		It’s fucking high tide. {getHighTideEmoji()}
	{:else if progress < 0.6}
		The tide’s fucking ok, I guess.
	{:else if progress < 0.7}
		The tide’s getting fucking low. 😞
	{:else}
		Ugh, it’s fucking low tide. 😫
	{/if}
</h1>

<style>
	h1 {
		font-size: 2.5rem;
	}
</style>
