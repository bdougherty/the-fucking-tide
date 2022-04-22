<script>
	import now from '$lib/stores/time';
	import { getNextTide, getTideProgress, getDistanceEmoji } from '$lib/tides';

	import FuckingTide from './FuckingTide.svelte';
	import TideDetail from './TideDetail.svelte';

	/** @type {import('src/app').TideStation!} */
	export let tideStation;

	/** @type {import('src/app').Coordinate!} */
	export let coordinate;

	$: nextTide = getNextTide(tideStation.predictions, $now);
	$: previousTide = nextTide && tideStation.predictions[tideStation.predictions.indexOf(nextTide) - 1];
	$: progress = getTideProgress(previousTide, nextTide, $now);
</script>

{#if tideStation.distance > 30}
	<h1>Uhh, there aren’t any tides near you.</h1>
	<p>Go somewhere closer to some fucking tidal water {getDistanceEmoji(tideStation.distance)}.</p>
{:else if nextTide}
	<FuckingTide {nextTide} {progress} />
	<TideDetail {nextTide} {tideStation} />
	<p class="more-info">
		<a href="https://tides.app/tides/{coordinate.lat},{coordinate.lon}" target="_blank">
			Get some more fucking details.
		</a>
	</p>
{/if}

<style>
	.more-info {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin: 0.25rem 0 0;
		max-width: none;
	}
</style>
