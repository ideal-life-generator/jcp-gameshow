define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var AudioHelper = require('app/helpers/audio');

	var JST = window.JST;
	var _ = window._;

	return View.extend({
		template: JST['assets/tpl/tv/waiting_screen.html'],
		render: function () {
			AudioHelper.loop('ambient');

			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));

			return this;
		}
	});
});