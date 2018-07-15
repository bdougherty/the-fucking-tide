import sirv from 'sirv';
import polka from 'polka';
import sapper from 'sapper';
import compression from 'compression';
import { routes } from './manifest/server.js';
import App from './App.html';
import FuckingTideStore from './store';

polka()
	.use(
		compression({ threshold: 0 }),
		sirv('assets'),
		sapper({
			routes,
			App,
			store: (request) => {
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
	.listen(process.env.PORT)
	.catch(err => {
		console.log('error', err);
	})
