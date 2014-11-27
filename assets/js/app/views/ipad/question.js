define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var Timer = require('app/views/player-timer');

	return View.extend({
		events: {
			'click .btn-version-a': 'onAnswerA',
			'click .btn-version-b': 'onAnswerB',
			'click .btn-version-c': 'onAnswerC',
			'click .btn-version-d': 'onAnswerD'
		},
		template: JST['assets/tpl/ipad/question.html'],
		game: null,
		initialize: function (data) {
			data = data || {};

			this.game = data.game;
			this.enableTimer = typeof data.enableTimer != 'undefined' ? data.enableTimer : true;
		},
		render: function () {
			var user = this.game.getMeUser();

			var currentQuestion = this.game.getCurrentQuestion();

			this.$el.html(this.template({
				game: this.game,
				question: currentQuestion,
				user: user
			}));

			if(user.get('answers')[currentQuestion.get('id')]){
				var variant = user.get('answers')[currentQuestion.get('id')].variant;
				this.$el.find('.btn-version-' + variant).addClass('active');
			}

			var questionTime = this.game.get('questionTimeLeft');
			var playerTime = this.game.getMeUser().get('timeLeft');

			var time = _.min([questionTime, playerTime]);

			this.questionTimer = new Timer({el: this.$el.find('.question-timer')});
			this.questionTimer.timeLeft = time;
			this.questionTimer.totalTime = time;
			this.questionTimer.size = Timer.SIZE_LARGE;
			this.questionTimer.active = this.enableTimer;
			this.questionTimer.render();

			this.hasAnswered = false;

			return this;
		},
		answer: function (variant) {
			if(this.hasAnswered){
				return;
			}

			this.hasAnswered = true;

			this.$el.find('.btn-version-' + variant).addClass('active');

			// Stop timer
			this.questionTimer.stop();

			socket.emit('game-answer', {
				id: this.game.get('id'),
				questionId: this.game.getCurrentQuestion().get('id'),
				variant: variant
			});
		},
		onAnswerA: function (e) {
			e.preventDefault();
			this.answer('a');
		},
		onAnswerB: function (e) {
			e.preventDefault();
			this.answer('b');
		},
		onAnswerC: function (e) {
			e.preventDefault();
			this.answer('c');
		},
		onAnswerD: function (e) {
			e.preventDefault();
			this.answer('d');
		}
	});
});
