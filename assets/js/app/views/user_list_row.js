define(function (require) {
	'use strict';

	var View = require('app/base/view');

	return View.extend({
		tagName: 'tr',
		template: JST['assets/tpl/admin/users.row.html'],
		initialize: function () {
			var self = this;
			this.model.on('change', this.renderBlink, this);
			this.model.on('destroy', self.remove, this);
		},
		render: function () {
			this.$el.html(this.template({data: this.model.toJSON()}));
			return this;
		},
		renderBlink: function () {
			return this.render().blink();
		}
	});

})