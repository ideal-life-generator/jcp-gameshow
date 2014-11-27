define(function (require) {
	'use strict';

	var View = require('app/base/view');

	var AudioHelper = require('app/helpers/audio');

	var JST = window.JST;
	var _ = window._;
	var socket = window.socket;

	return View.extend({
		template: JST['assets/tpl/admin/game/question.html'],
		initialize: function (data) {
			data = data || {};

			this.game = data.game;
			this.showCorrect = typeof data.showCorrect != 'undefined' ? data.showCorrect : false;
		},
		render: function () {

			var currentQuestion = this.game.getCurrentQuestion();

			this.$el.html(this.template({
				game: this.game,
				question: currentQuestion
			}));

			if(this.showCorrect){
				AudioHelper.play('correct');

				var that = this;
				_.each(currentQuestion.get('correct'), function(answer){
					that.$el.find('.btn-version-'+answer).addClass('blinking');
				});
			}

			return this;
		}
	});
});