<script>
	/** @type {import('src/app').TideStation} */
	export let tideStation;
	/** @type {import('src/app').Coordinate} */
	export let coordinate;

	/**
	 * @param {Array<string>} emojis
	 */
	function getRandomEmoji(emojis) {
		return emojis[Math.floor(Math.random() * emojis.length)];
	}

	/**
	 * @param {number} distance
	 */
	function getDistanceEmoji(distance) {
		if (distance < 500) {
			return getRandomEmoji(['🚗', '🚙']);
		}

		return '✈️';
	}

	function getHighTideEmoji() {
		return getRandomEmoji(['🤙', '🏄‍♀️', '🏄‍♂️', '🛶', '🚤', '⛵️', '🛥', '🏖', '😎', '💯']);
	}

	// todo - move to parent and make it an updating store
	let now = new Date();

	/**
	 *
	 * @param {import('src/app').TidePrediction} previous
	 * @param {import('src/app').TidePrediction} next
	 */
	function getTideProgress(previous, next) {
		const previousTime = new Date(previous.time).getTime();
		const timeSincePreviousTide = now.getTime() - previousTime;
		const tideDifference = new Date(next.time).getTime() - previousTime;
		const progress = timeSincePreviousTide / tideDifference;

		return progress;
	}

	/**
	 * @param {import('src/app').TidePrediction} nextTide
	 * @param {number} progress
	 */
	function getTideMessage(nextTide, progress) {
		const rising = nextTide.type === 'high';
		const messages = {
			low: 'Ugh, it’s fucking low tide. 😫',
			rising1: 'The tide’s still pretty fucking low. 😞',
			rising2: 'It’s almost fucking high tide. 🙌',
			high: `It’s fucking high tide. ${getHighTideEmoji()}`,
			falling1: 'The tide’s fucking ok, I guess.',
			falling2: 'The tide’s getting fucking low. 😞'
		};

		if (progress < 0.3) {
			return rising ? messages.low : messages.high;
		}

		if (progress < 0.6) {
			return rising ? messages.rising1 : messages.falling1;
		}

		if (progress < 0.7) {
			return rising ? messages.rising2 : messages.falling2;
		}

		return rising ? messages.high : messages.low;
	}

	const dateFormatter = new Intl.DateTimeFormat('default', {
		timeStyle: 'short'
	});

	$: nextTide = tideStation.predictions.find((prediction) => {
		return new Date(prediction.time) > now;
	});
	$: previousTide = tideStation.predictions[tideStation.predictions.indexOf(nextTide) - 1];
	$: tideProgress = getTideProgress(previousTide, nextTide);
	$: nextTideTime = dateFormatter.format(new Date(nextTide.time));
	$: formattedType = nextTide.type === 'high' ? 'High' : 'Low';
</script>

{#if tideStation.distance > 30}
	<h1>Uhh, there aren’t any tides near you.</h1>
	<p>Go somewhere closer to some fucking tidal water {getDistanceEmoji(tideStation.distance)}.</p>
{:else}
	<h1 class="the-fucking-tide">{getTideMessage(nextTide, tideProgress)}</h1>
	<p class="station">
		{formattedType} tide is
		<time datetime={nextTide.time}>{nextTideTime}</time>
		at {tideStation.name}.
	</p>
	<p class="more-info">
		<a href="https://tides.app/tides/{coordinate.lat},{coordinate.lon}" target="_blank">
			Get some more fucking details.
		</a>
	</p>
{/if}

<style>
	.the-fucking-tide {
		font-size: 2.5rem;
	}

	.station,
	.more-info {
		font-size: 0.8rem;
		color: #595959;
		margin: 0.25rem 0 0;
		max-width: none;
	}
</style>
