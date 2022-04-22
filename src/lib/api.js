/**
 * @param {TemplateStringsArray} strings
 * @returns {string}
 */
function gql(strings) {
	return strings
		.map((string) => {
			return string
				.replace(/\s+/g, ' ')
				.replace(/\s?([():{}])\s?/g, '$1')
				.trim();
		})
		.join('');
}

/**
 * @param {import('src/app').Coordinate} coordinate
 * @returns {import('src/app').Coordinate}
 */
function truncateCoordinate({ lat, lon }) {
	return {
		lat: Number.parseFloat(lat.toFixed(4)),
		lon: Number.parseFloat(lon.toFixed(4))
	};
}

/**
 * @returns {Promise<import('src/app').Coordinate>}
 */
export function getGeolocation() {
	return new Promise((resolve, reject) => {
		if (typeof navigator === 'undefined') {
			throw new TypeError('Geolocation not available');
		}

		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				const coordinate = {
					lat: coords.latitude,
					lon: coords.longitude
				};

				resolve(truncateCoordinate(coordinate));
			},
			(error) => reject(error)
		);
	});
}

/**
 * @param {string} search
 * @returns {Promise<import('src/app').Coordinate>}
 */
export async function geocode(search) {
	const response = await fetch(import.meta.env.VITE_API_URL, {
		method: 'POST',
		body: JSON.stringify({
			query: gql`
				query ($search: String!) {
					geocode(query: $search) {
						lat
						lon
					}
				}
			`,
			variables: {
				search
			}
		})
	});

	const { data } = await response.json();
	return truncateCoordinate(data.geocode[0]);
}

/**
 * @param {import('src/app').Coordinate} coordinate
 * @returns {Promise<import('src/app').TideStation>}
 */
export async function getTideStation(coordinate) {
	const response = await fetch(import.meta.env.VITE_API_URL, {
		method: 'POST',
		body: JSON.stringify({
			query: gql`
				query ($coordinate: Coordinate!) {
					tideStations(coordinate: $coordinate, limit: 1) {
						name
						distance(units: mi)
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
	});

	const { data } = await response.json();
	return data.tideStations[0];
}
