define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var CommonHelper = require('app/helpers/common');

	return View.extend({
		template: JST['assets/tpl/admin/category.edit.html'],
		events: {
			'submit #edit-category-from': 'submit'
		},
		render: function () {
			this.$el.html(this.template({data: this.model.toJSON(), model: this.model}));
			return this;
		},
		submit: function (e) {
			e.preventDefault();

			this.updateModel();
			var model = this.model;

			model.save()
				.done(function (data) {
					CommonHelper.msg(polyglot.t("Param-pam-pam!"));
					Backbone.history.navigate('/category', {trigger: true});
				})
				.fail(function () {
					CommonHelper.errorMsg('Error');
					CommonHelper.parseResponse.apply(CommonHelper, arguments);
				});

		},
		updateModel: function () {
			var model = this.model;

			model.set('name', this.$('.name').val());
		},
		remove: function () {
			this.model.off('change', this.changed, this);
			return View.prototype.remove.apply(this, arguments);
		}
	});

});