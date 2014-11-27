'use strict';

module.exports = (function () {

	/**
	 * Temporary answer constructor.
	 *
	 * @constructor
	 */
	var Answer = function (data, game, user) {
		this.data = data || {};
		this.game = game || {};
		this.user = user || {};

		this.actualTime = 0;
	};

	/**
	 * Check is answer correct.
	 *
	 * @returns {boolean}
	 */
	Answer.prototype.isCorrect = function () {
		var variant = this.data.variant;
		var correct = this.data.correct;

		for (var i in correct) {
			if (correct[i] === variant) return true;
		}

		return false;
	};

	/**
	 * Check is answer incorrect.
	 *
	 * @returns {boolean}
	 */
	Answer.prototype.isIncorrect = function () {
		return !this.isCorrect();
	};

	/**
	 * Convert answer into JSON.
	 *
	 * @returns {Object}
	 */
	Answer.prototype.toJSON = function () {
		return {
			isCorrect : this.isCorrect(),
			variant : this.data.variant,
			actualTime : this.actualTime
		};
	};

	return Answer;

})();
