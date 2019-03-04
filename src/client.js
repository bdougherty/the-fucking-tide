import * as sapper from '../__sapper__/client.js';
import FuckingTideStore from './store';

sapper.start({
	target: document.querySelector('#sapper'),
	store: (data) => {
		return new FuckingTideStore(data);
	}
});
