define(function (require) {
	'use strict';

	var View = require('app/base/view');

	var socket = window.socket;
	var JST = window.JST;
	var _ = window._;

	return View.extend({
		_usersEl: null,
		template: JST['assets/tpl/admin/game/join_users.html'],
		events: {
			'click .btn-start': 'onStart'
		},

		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));

			return this;
		},
		onStart: function (e) {
			e.preventDefault();

			this.$el.find('.btn-start').hide();

			socket.emit('game-start', this.model.toJSON());
		}
	});
});