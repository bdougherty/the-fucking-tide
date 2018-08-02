import { init } from 'sapper/runtime';
import { manifest } from './manifest/client';
import FuckingTideStore from './store';

init({
	target: document.querySelector('#sapper'),
	manifest,
	store: (data) => {
		const store = new FuckingTideStore(data);

		if (process.env.NODE_ENV === 'development') {
			window.store = store;
		}

		return store;
	}
});
