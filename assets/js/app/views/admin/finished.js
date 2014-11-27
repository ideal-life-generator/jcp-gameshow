/**
 * This view is shown after game has been completed.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var LicensePlate = require('app/views/license_plate');
	var Video = require('app/views/video');
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/admin/game/finished.html'],
		events: {
			'click .btn-start-over': 'onEndGame'
		},

		render: function () {
			var winner = this.model.getWinner();

			this.$el.html(this.template({
				game: this.model,
				winner: winner
			}));

			var license = new LicensePlate({model: winner});
			license.render().html(this.$el.find('.license-plate'));

			return this;
		},

		onEndGame: function (e) {
			e.preventDefault();

			socket.emit('game-finish', this.model.toJSON());
		}
	})

});