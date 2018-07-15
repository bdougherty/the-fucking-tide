import { init } from 'sapper/runtime.js';
import { routes } from './manifest/client.js';
import App from './App.html';
import FuckingTideStore from './store';

init({
	target: document.querySelector('#sapper'),
	routes,
	App,
	store: (data) => {
		const store = new FuckingTideStore(data);

		if (process.env.NODE_ENV === 'development') {
			window.store = store;
		}

		return store;
	}
});
