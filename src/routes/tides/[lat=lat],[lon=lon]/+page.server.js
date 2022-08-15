import { error } from '@sveltejs/kit';
import { getTideStation } from '$lib/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const tideStation = await getTideStation({
		lat: Number.parseFloat(params.lat),
		lon: Number.parseFloat(params.lon)
	});

	if (tideStation) {
		return { tideStation };
	}

	throw error(404, 'Not found');
}
