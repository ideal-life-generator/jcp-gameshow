define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		tagName: 'tr',
		template: JST['assets/tpl/admin/question.row.html'],
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));
			return this;
		}
	});
});