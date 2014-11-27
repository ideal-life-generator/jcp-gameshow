define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var PlayersRow = require('app/views/players-row');

	var socket = window.socket;
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		_usersEl: null,
		template: JST['assets/tpl/tv/join_users.html'],
		render: function () {

			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));

			var players = this.model.getPlayers();
			var playerRow = new PlayersRow({collection: players});
			playerRow.showPosition = false;
			playerRow.render().html(this.$el.find('.players-row'));

			return this;
		}
	});
});