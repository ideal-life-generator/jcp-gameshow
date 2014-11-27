define(function (require) {
	'use strict';

	var Model = require('app/base/model');

	return Model.extend({
		_categories: null,
		_levels: null,

		name: 'question',
		urlRoot: '/question',
		defaults: {
			question: '',
			versionA: '',
			versionB: '',
			versionC: '',
			versionD: '',
			correct: [],
			timeLimit: 15,
			timePenalty: 5
		},
		getCategoryName: function () {
			var category;

			if (this._categories) {
				category = this._categories.get(this.get('categoryId'));
				if (category) return category.get('name');
			}
			return null;
		},
		/**
		 * Get level name.
		 */
		getLevelName: function(){
			var level;

			if (this._levels) {
				level = this._levels.get(this.get('level'));
				if (level) return level.get('name');
			}
			return null;

		},
		toggleCorrect: function (version) {
			return this.isCorrect(version) ? this.setWrong(version) : this.setCorrect(version);
		},
		isCorrect: function (version) {
			return _.indexOf(this.get('correct'), version.toLowerCase()) !== -1;
		},
		isWrong: function (version) {
			return !this.isCorrect(version);
		},
		setCorrect: function (version) {
			var correct = _.clone(this.get('correct'));
			if (this.isWrong(version)) {
				correct.push(version.toLowerCase());
				this.set('correct', _.toArray(correct));
			}
			return this;
		},
		setWrong: function (version) {
			var correct = _.clone(this.get('correct'));
			if (this.isCorrect(version)) this.set('correct', _.without(correct, version.toLowerCase()));
			return this;
		},
		getTimeLeft: function () {
			// in seconds
			var timeLeft = (new Date(this.get('end')).getTime() - new Date().getTime()) / 1000;
			return timeLeft > 0 ? timeLeft : 0;
		},
		getTimeLimit: function () {
			return this.get('timeLimit');
		}
	});

});