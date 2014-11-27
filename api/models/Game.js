"use strict";

var PAUSE_BETWEEN_QUESTIONS = 3000; // in milliseconds
var _ = require('underscore');

module.exports = {

	attributes: {
		categoryId: 'string',
		player: 'json',
		questions: 'array',
		currentQuestion: 'json',
		answers: {
			type: 'array',
			defaultsTo: []
		},
		endAt: 'date',
		totalTime: 'float', // totaltime in seconds
		questionNumber: {
			type: 'integer'
		},
		rating: {
			type: 'float',
			defaultsTo: 0
		},

		sync: function () {
			if (this.isFinished()) return this.publishFinished();
			if (this.hasValidCurrentQuestion()) return this.publishUnchanged();
			else return this.goNext();
		},

		answer: function (answer) {
			if (this.isFinished()) return this.publishFinished();
			if (this.hasValidCurrentQuestion()) return this.internalAnswer(answer);
			else return this.goNext();
		},

		internalAnswer: function (answer) {
			var self = this;

			if (answer.questionId === this.currentQuestion.questionId) {

			}
			else return this.publishUnchanged();
		},

		isFinished: function () {
			// todo: check timestamp of finish time
			return new Date().getTime() > new Date(this.endAt).getTime();
		},

		// got next question
		goNext: function () {
			var self = this;
			var nextQuestionId = this.questions.pop();

			if (this.hasCurrentQuestion()) {
				this.answers.push({
					questionId: this.currentQuestion.id,
					answer: null // mark answer
				});
			}

			if (nextQuestionId) {
				Question.findOne(nextQuestionId.toString()).exec(function (err, question) {

					if (!err && question) {
						self.currentQuestion = question.toJSON();

						self.save(function (err) {
							if (!err) {
								self.publishUpdate();
							}
						});
					}
				});
			} else {

			}

		},

		hasCurrentQuestion: function () {
			return !_.isEmpty(this.currentQuestion);
		},

		hasValidCurrentQuestion: function () {
			if (this.hasCurrentQuestion()) return new Date(this.currentQuestion.endAt).getTime() > new Date().getTime();
			else return false;
		},

		publishUnchanged: function () {
			return this.publish({verb: 'unchanged'});
		},

		// publish current question
		publishCurrentQuestion: function () {
			this.publishQuestion();
		},

		publishQuestion: function () {
			return this.publish({
				verb: 'question',
				data: this.currentQuestion
			});
		},

		publish: function (data) {
			Game.publish(this, _.extend({
				id: this.id,
				model: 'game',
				data: this.toJSON()
			}, data));

			return this;
		},

		finish: function () {
			// todo: finish game
		},

		publishFinished: function () {
			return this.publish({
				verb: 'finished'
			});
		},

		publishUpdate: function () {
			return this.publish({verb: 'update'});
		},

		isPlayer: function (player) {
			if (!player) return false;
			return player.name === this.player.name && player.email === this.player.email;
		}

	},

	// define default properties before document creation
	beforeCreate: function (values, next) {
		var _questions = []; // questions ids
		var totalTime = 0; // to

		_.each(values.questions, function (question) {
			_questions.push(question._id);
			totalTime += question.timeLimit;
		});

		values = _.extend(values, {
			questions: _questions,
			questionNumber: _questions.length,
			totalTime: totalTime, // do not cahnge
			endAt: new Date(new Date().getTime() + totalTime * 1000 + (_questions.length - 1) * PAUSE_BETWEEN_QUESTIONS)
		});

		return next();
	}

};