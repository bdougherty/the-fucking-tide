/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(parameter) {
	const parsed = Number.parseFloat(parameter);
	return !Number.isNaN(parsed) && parsed >= -180 && parsed <= 180;
}
