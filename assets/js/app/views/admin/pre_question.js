define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var JST = window.JST;
	var _ = window._;
	var socket = window.socket;

	return View.extend({
		template: JST['assets/tpl/admin/game/pre.question.html'],
		events: {
			'click .btn-start-question':'startQuestion'
		},
		initialize: function (data) {
			var self = this;
			data = data || {};

			this.game = data.game;
		},
		render: function () {

			this.$el.html(this.template({
				game: this.game,
				question: this.game.getCurrentQuestion()
			}));

			return this;
		},
		/**
		 * Start a question.
		 */
		startQuestion: function(e){
			e.preventDefault();

			socket.emit('game-start-question', this.game.toJSON());
		}
	});
});