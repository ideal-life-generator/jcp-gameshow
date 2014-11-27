/**
 * This view is shown to client after question has been completed.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var PlayersRow = require('app/views/players-row');
	var Video = require('app/views/video');
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/admin/game/after.question.html'],
		events: {
			'click .btn-next-question': 'onNextQuestion'
		},

		render: function () {
			this.$el.html(this.template({
				game: this.model,
				question: this.model.getCurrentQuestion()
			}));

			return this;
		},

		onNextQuestion: function (e) {
			e.preventDefault();

			socket.emit('game-next-question', {
				id: this.model.get('id')
			});
		}
	})

});