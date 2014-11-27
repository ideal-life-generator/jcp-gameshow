define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var LicenseView = require('app/views/license_plate');
	var JST = window.JST;

	return View.extend({
		template: JST['assets/tpl/site/game.results.html'],
		initialize: function (data) {
			data = data || {};

			this.player = data.player;
		},
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));

			var plate = new LicenseView({model: this.player});
			plate.render().html(this.$el.find('.license-plate'));

			return this;
		}
	});
});