import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '../__sapper__/server.js';
import FuckingTideStore from './store';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka()
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			store: () => {
				return new FuckingTideStore({
					time: null,
					findingLocation: true,
					locationError: null,
					location: null,
					fetchingPredictions: false,
					predictionError: null,
					predictions: [],
					stationName: null,
					stationDistance: -1
				});
			}
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
