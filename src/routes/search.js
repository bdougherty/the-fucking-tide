import { geocode } from '$lib/api';

/** @type {import('./search').RequestHandler} */
export async function post({ request }) {
	const data = await request.formData();
	const query = data.get('query');

	try {
		const { lat, lon } = await geocode(`${query}`);

		return {
			status: 303,
			headers: {
				location: `/tides/${lat},${lon}`
			}
		};
	} catch {
		return {
			status: 302,
			headers: {
				location: '/'
			}
		};
	}
}
