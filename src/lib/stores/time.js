import { readable } from 'svelte/store';

export default readable(new Date(), function start(set) {
	function setToNow() {
		set(new Date());
	}

	function handleVisibilityChange() {
		if (!document.hidden) {
			setToNow();
		}
	}

	let interval = setInterval(setToNow, 1000 * 60);

	if (typeof document !== 'undefined') {
		document.addEventListener('visibilitychange', handleVisibilityChange);
	}

	return () => {
		clearInterval(interval);

		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		}
	};
});
