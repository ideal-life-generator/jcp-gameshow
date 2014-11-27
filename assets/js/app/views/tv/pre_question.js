define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var PlayersRow = require('app/views/players-row');
	var JST = window.JST;
	var _ = window._;
	var socket = window.socket;

	return View.extend({
		template: JST['assets/tpl/tv/pre.question.html'],
		initialize: function (data) {
			data = data || {};

			this.game = data.game;
		},
		render: function () {

			this.$el.html(this.template({
				game: this.game,
				question: this.game.getCurrentQuestion()
			}));

			var players = this.game.getPlayers();
			var playerRow = new PlayersRow({collection: players});
			playerRow.render().html(this.$el.find('.players-row'));

			return this;
		}
	});
});