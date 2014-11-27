define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var JST = window.JST;

	return View.extend({
		template: JST['assets/tpl/common/license-plate.html'],
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));

			return this;
		}
	});
});