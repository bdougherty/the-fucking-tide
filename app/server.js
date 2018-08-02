import sirv from 'sirv';
import polka from 'polka';
import sapper from 'sapper';
import compression from 'compression';
import { manifest } from './manifest/server';
import FuckingTideStore from './store';

polka()
	.use(
		compression({ threshold: 0 }),
		sirv('assets'),
		sapper({
			manifest,
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
	.listen(process.env.PORT)
	.catch((err) => {
		console.log('error', err);
	});
