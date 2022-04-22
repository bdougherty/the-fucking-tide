<script>
	import fsm from 'svelte-fsm';
	import { browser } from '$app/env';
	import { geocode, getTideStation, getGeolocation } from '$lib/api';
	import { shouldFetchPredictions } from '$lib/tides';
	import now from '$lib/stores/time';

	import DotWave from '$lib/components/DotWave.svelte';
	import Forecast from '$lib/components/Forecast.svelte';
	import Search from '$lib/components/Search.svelte';

	/** @type {import('src/app').Coordinate?} */
	let coordinate = null;

	/** @type {import('src/app').TideStation?} */
	let tideStation = null;

	let searchText = '';

	const state = fsm('initial', {
		initial: {
			_enter() {
				if (!browser) {
					return;
				}

				if (navigator.geolocation) {
					this.promptForGeolocation();
					return;
				}

				this.search();
			},
			search: 'search',
			promptForGeolocation: 'geolocationPrompt'
		},
		search: {
			submit: 'submittingSearch'
		},
		submittingSearch: {
			_enter() {
				geocode(searchText)
					.then((coords) => {
						coordinate = coords;
						this.success();
					})
					.catch(() => {
						this.error();
					});
			},
			success: 'gettingForecast',
			error: 'search'
		},
		geolocationPrompt: {
			_enter() {
				getGeolocation()
					.then((coords) => {
						coordinate = coords;
						this.success();
					})
					.catch(() => {
						this.error();
					});
			},
			success: 'gettingForecast',
			error: 'search'
		},
		gettingForecast: {
			_enter() {
				getTideStation(coordinate)
					.then((station) => {
						tideStation = station;
						this.success();
					})
					.catch(() => {
						this.error();
					});
			},
			success: 'forecast',
			error: 'error'
		},
		forecast: {
			refresh: 'gettingForecast'
		},
		error: {}
	});

	$: if (tideStation && shouldFetchPredictions(tideStation.predictions, $now)) {
		state.refresh();
	}
</script>

<svelte:head>
	<title>The Fucking Tide</title>
</svelte:head>

{#if $state === 'geolocationPrompt' || $state === 'submittingSearch' || $state === 'gettingForecast'}
	<h1 class="loading">
		{#if $state === 'gettingForecast'}
			Checking the fucking tide
		{:else}
			Finding your fucking location
		{/if}
		<DotWave --dw-size="0.75em" />
	</h1>
{:else if $state === 'search' || $state === 'initial'}
	<Search bind:value={searchText} on:submit={() => state.submit()} />
{:else if $state === 'forecast'}
	{#if tideStation && coordinate}
		<Forecast {tideStation} {coordinate} />
	{/if}
{:else if $state === 'error'}
	<h1>We fucked up</h1>
	<p>Check back later.</p>
{/if}

<style>
	.loading {
		color: var(--text-secondary);
		font-weight: 500;
	}
</style>
