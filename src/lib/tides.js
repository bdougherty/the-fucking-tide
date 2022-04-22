/**
 * @param {[import('src/app').TidePrediction]} predictions
 * @param {Date} now
 */
export function getNextTide(predictions, now) {
	const result = predictions.find((prediction) => {
		return new Date(prediction.time) > now;
	});

	if (!result) {
		return null;
	}

	return result;
}

/**
 * @param {[import('src/app').TidePrediction]} predictions
 * @param {Date} now
 */
export function shouldFetchPredictions(predictions, now) {
	const nextTide = getNextTide(predictions, now);

	if (!nextTide) {
		return true;
	}

	const index = predictions.indexOf(nextTide);

	if (index === -1 || index >= predictions.length - 1) {
		return true;
	}

	return false;
}

/**
 * @param {import('src/app').TidePrediction?} previous
 * @param {import('src/app').TidePrediction?} next
 * @param {Date} now
 */
export function getTideProgress(previous, next, now) {
	if (!previous || !next) {
		return 0
	}

	const previousTime = new Date(previous.time).getTime();
	const timeSincePreviousTide = now.getTime() - previousTime;
	const tideDifference = new Date(next.time).getTime() - previousTime;
	const progress = timeSincePreviousTide / tideDifference;

	return progress;
}

/**
	 * @param {Array<string>} emojis
	 */
function getRandomEmoji(emojis) {
	return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * @param {number} distance
 */
export function getDistanceEmoji(distance) {
	if (distance < 500) {
		return getRandomEmoji(['🚗', '🚙']);
	}

	return '✈️';
}

export function getHighTideEmoji() {
	return getRandomEmoji(['🤙', '🏄‍♀️', '🏄‍♂️', '🛶', '🚤', '⛵️', '🛥', '🏖', '😎', '💯']);
}
