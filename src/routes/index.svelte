<script>
	import { browser } from '$app/env';
import Forecast from '$lib/components/Forecast.svelte';
	import fsm from 'svelte-fsm';

	let coordinate = null;
	let searchText = '';
	let tideStation = null;

	function gql(strings) {
		return strings.map((string) => {
			return string.replace(/\s+/g, ' ').replace(/\s?([{}():])\s?/g, '$1').trim();
		}).join('');
	}

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
				// request coordinates
				console.log('request for', searchText);
				fetch('https://api.tides.app/graphql', {
					method: 'POST',
					body: JSON.stringify({
						query: gql`
							query($searchText: String!) {
								geocode(query: $searchText) {
									lat
									lon
								}
							}
						`,
						variables: {
							searchText
						}
					})
				})
				.then((response) => response.json())
				.then(({ data }) => {
					coordinate = data.geocode[0];
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
				/**
				 * @param GeolocationPosition
				 */
				const onSuccess = ({ coords }) => {
					coordinate = {
						lat: coords.latitude,
						lon: coords.longitude
					};

					this.success();
				};

				const onError = (error) => {
					console.log(error);
					this.error();
				}

				navigator.geolocation.getCurrentPosition(onSuccess, onError);
			},
			success: 'gettingForecast',
			error: 'search'
		},
		gettingForecast: {
			_enter() {
				fetch('https://api.tides.app/graphql', {
					method: 'POST',
					body: JSON.stringify({
						query: gql`
							query($coordinate: Coordinate!) {
								tideStations(coordinate: $coordinate, limit: 1) {
									name
									distance(units:mi)
									predictions {
										type
										time
									}
								}
							}
						`,
						variables: {
							coordinate
						}
					})
				})
				.then((response) => response.json())
				.then(({ data }) => {
					tideStation = data.tideStations[0];
					this.success();
				})
				.catch(() => {
					this.error();
				});
			},
			success: 'forecast',
			error: 'error'
		},
		forecast: {},
		error: {}
	});

	function handleSubmit() {
		state.submit();
	}
</script>

<svelte:head>
	<title>The Fucking Tide</title>
</svelte:head>

{#if $state === 'geolocationPrompt' || $state === 'submittingSearch'}
	<h1 class="loading">Finding your fucking location…</h1>
{:else if $state === 'gettingForecast'}
	<h1 class="loading">Checking the fucking tide…</h1>
{:else if $state === 'search' || $state === 'initial'}
	<form on:submit|preventDefault={handleSubmit}>
		<h1>Where the fuck are you?</h1>
		<div class="fields">
			<input type="search" class="shadow" bind:value="{searchText}" />
			<button class="shadow">Get the Fucking Tide</button>
		</div>
	</form>
{:else if $state === 'forecast'}
	<Forecast tideStation={tideStation} coordinate={coordinate} />
{:else if $state === 'error'}
	<h1>We fucked up</h1>
	<p>Check back later.</p>
{/if}

<style>
	.loading {
		color: #595959;
		font-weight: 500;
	}
</style>
