define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var CategoryListRowView = require('app/views/category_list_row');

	return View.extend({
		_tbody: null,
		template: JST['assets/tpl/admin/category.table.html'],
		render: function () {
			this.$el.html(this.template());
			this.renderRows();
			return this;
		},
		renderRows: function () {
			var self = this;

			self.collection.each(function (model) {
				self.renderRow(model);
			});
		},
		renderRow: function (model) {
			new CategoryListRowView({model: model}).render().append(this.getTBody());
		},
		getTBody: function () {
			if (!this._tbody) {
				this._tbody = this.$('tbody');
			}
			return this._tbody;
		}

	});

});