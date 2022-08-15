<script>
	import { page } from '$app/stores';
	import Forecast from '$lib/components/Forecast.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	$: coordinate = {
		lat: Number.parseFloat($page.params.lat),
		lon: Number.parseFloat($page.params.lon)
	};
</script>

<svelte:head>
	<title>The Fucking Tide for {data.tideStation.name}</title>
</svelte:head>

<Forecast tideStation={data.tideStation} {coordinate} />
