define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var PlayersRow = require('app/views/players-row');

	var AudioHelper = require('app/helpers/audio');

	var JST = window.JST;
	var _ = window._;
	var socket = window.socket;

	return View.extend({
		template: JST['assets/tpl/tv/question.html'],
		initialize: function (data) {
			var self = this;
			data = data || {};

			this.game = data.game;
		},
		render: function () {

			var currentQuestion = this.game.getCurrentQuestion();

			this.$el.html(this.template({
				game: this.game,
				question: currentQuestion
			}));

			var players = this.game.getPlayers();
			var playerRow = new PlayersRow({collection: players});
			playerRow.render().html(this.$el.find('.players-row'));

			AudioHelper.stopAll();

			AudioHelper.play('suspense');

			return this;
		},
		showCorrect: function(){
			AudioHelper.play('correct');

			var currentQuestion = this.game.getCurrentQuestion();

			var that = this;
			_.each(currentQuestion.get('correct'), function(answer){
				that.$el.find('.btn-version-'+answer).addClass('blinking');
			});
		}
	});
});