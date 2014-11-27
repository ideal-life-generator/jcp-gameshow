/**
 * This view is shown after game has been completed.
 */
define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var PlayersRow = require('app/views/players-row');
	var LicensePlate = require('app/views/license_plate');

	var AudioHelper = require('app/helpers/audio');

	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/tv/finished.html'],

		render: function () {
			AudioHelper.loop('ambient');

			var winner = this.model.getWinner();

			this.$el.html(this.template({
				game: this.model,
				winner: winner
			}));

			var players = this.model.getPlayers();
			players = _.sortBy(players, function(player){
				if((player.get('position') == null)){
					// Exception for the purposes of sorting.
					// Will place timed-out users in the end of list.
					return 999;
				}
				else{
					return player.get('position');
				}
			});

			var playerRow = new PlayersRow({collection: players});
			playerRow.activateTimers = false;
			playerRow.render().html(this.$el.find('.players-row'));

			var license = new LicensePlate({model: winner});
			license.render().html(this.$el.find('.license-plate'));

			return this;
		}
	})

});