define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var UserListRow = require('./user_list_row');

	return View.extend({
		template: JST['assets/tpl/admin/users.table.html'],
		initialize: function () {
			var self = this;

			self.collection.on('add', function (model, collection, options) {
				self.renderRow.apply(self, arguments).blink();
			}, self);
		},
		render: function () {
			var self = this;
			this.$el.html(self.template());
			this.collection.each(function () {
				self.renderRow.apply(self, arguments);
			});
			return this;
		},
		renderRow: function (model) {
			var rowView = new UserListRow({model: model}).render();
			this.$('tbody').append(rowView.el);
			return rowView;
		}
	});

});