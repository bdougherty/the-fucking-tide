import { Store } from 'svelte/store.js';

class FuckingTideStore extends Store {
	constructor(data) {
		super(data);

		this.on('state', ({ changed, current }) => {
			if (changed.location && current.location !== null) {
				this.fetchPredictions();
				return;
			}

			if (changed.time) {
				const { predictions, nextTide } = current;

				if (current.location && predictions.indexOf(nextTide) === predictions.length - 1) {
					this.fetchPredictions(true);
				}

				return;
			}
		});

		this.compute('nextTide', ['predictions', 'time'], (predictions, time) => {
			if (predictions.length === 0) {
				return null;
			}

			return predictions.find((prediction) => {
				return new Date(prediction.time) > time;
			});
		});

		this.compute('previousTide', ['predictions', 'nextTide'], (predictions, nextTide) => {
			if (!nextTide) {
				return null;
			}

			const index = predictions.indexOf(nextTide);
			return predictions[index - 1];
		});

		this.compute('tideProgress', ['time', 'previousTide', 'nextTide'], (time, previousTide, nextTide) => {
			if (!previousTide || !nextTide) {
				return -1;
			}

			const timeSincePreviousTide = time - new Date(previousTide.time);
			const tideDifference = new Date(nextTide.time) - new Date(previousTide.time);
			const progress = timeSincePreviousTide / tideDifference;

			return progress;
		});
	}

	startTimer() {
		this.stopTimer();
		this.interval = setInterval(() => this.updateTime(), 1000 * 60);
		this.updateTime();
	}

	stopTimer() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	updateTime() {
		this.set({
			time: new Date()
		});
	}

	getGeolocation() {
		const onSuccess = ({ coords }) => {
			this.set({
				findingLocation: false,
				location: {
					lat: coords.latitude,
					lon: coords.longitude
				}
			});
		};

		const onError = (error) => {
			this.set({
				findingLocation: false,
				locationError: error
			});
		};

		this.set({
			location: null,
			findingLocation: true
		});

		if (!navigator.geolocation) {
			this.set({
				findingLocation: false,
				locationError: new Error('Geolocation not available in this browser.')
			});

			return;
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}

	async makeGraphQLRequest(query, variables) {
		const request = await fetch('https://api.tides.app/graphql', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				query: query.replace(/\s+/g, ' ').replace(/\s?([{}():])\s?/g, '$1').trim(),
				variables
			})
		});

		const json = await request.json();

		if (json.errors) {
			console.info(json.errors);
			throw new Error('there was an error');
		}

		return json.data;
	}

	async geocode(search) {
		const query = `
			query($search: String!) {
				geocode(query: $search) {
					lat
					lon
				}
			}
		`;

		try {
			this.set({
				findingLocation: true
			});

			const data = await this.makeGraphQLRequest(query, { search });
			const { lat, lon } = data.geocode[0];

			this.set({
				findingLocation: false,
				locationError: null,
				location: {
					lat,
					lon
				}
			});
		}
		catch (error) {
			this.set({
				findingLocation: false,
				locationError: new Error('Could not geocode.')
			});
		}
	}

	async fetchPredictions(silent = false) {
		const query = `
			query($coordinate: Coordinate!) {
				tideStations(coordinate: $coordinate, limit: 1) {
					name
					distance
					predictions {
						type
						time
					}
				}
			}
		`;

		const { location } = this.get();

		if (!location) {
			return;
		}

		if (!silent) {
			this.set({
				fetchingPredictions: true
			});
		}

		const { lat, lon } = location;
		const data = await this.makeGraphQLRequest(query, {
			coordinate: {
				lat,
				lon
			}
		});

		const { name, distance, predictions } = data.tideStations[0];

		this.set({
			fetchingPredictions: false,
			predictions,
			stationName: name,
			stationDistance: distance
		});
	}
}

export default FuckingTideStore;
