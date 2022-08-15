import { getTideStation } from '$lib/api';

/** @type {import('./[lat=lat],[lon=lon]').RequestHandler} */
export async function get({ params }) {
	const tideStation = await getTideStation({
		lat: Number.parseFloat(params.lat),
		lon: Number.parseFloat(params.lon)
	});

	if (tideStation) {
		return {
			body: { tideStation }
		};
	}

	return {
		status: 404
	};
}
