<script>
	import { page } from '$app/stores';
	import Forecast from '$lib/components/Forecast.svelte';

	/** @type {import('src/app').TideStation} */
	export let tideStation;

	$: coordinate = {
		lat: Number.parseFloat($page.params.lat),
		lon: Number.parseFloat($page.params.lon)
	};
</script>

<Forecast {tideStation} {coordinate} />
