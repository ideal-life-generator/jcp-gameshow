define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var CommonHelper = require('app/helpers/common');

	return View.extend({
		template: JST['assets/tpl/admin/users.edit.html'],
		events: {
			'submit #edit-user-from': 'submit'
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
				.done(function () {
					CommonHelper.msg(polyglot.t("User update successfully"));
					Backbone.history.navigate('/user', {trigger: true});
				})
				.fail(function () {
					CommonHelper.errorMsg(polyglot.t("Error"));
					CommonHelper.parseResponse.apply(CommonHelper, arguments);
				});

		},
		updateModel: function () {
			var model = this.model;

			model.set('firstName', this.$('.firstName').val());
			model.set('lastName', this.$('.lastName').val());
			model.set('email', this.$('.email').val());
			model.set('role', this.$('.role').val());

		},
		remove: function () {
			this.model.off('change', this.changed, this);
			return View.prototype.remove.apply(this, arguments);
		}
	});

});