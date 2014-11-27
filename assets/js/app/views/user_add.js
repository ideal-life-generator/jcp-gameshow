define(function (require) {

	var View = require('app/base/view');
	var CommonHelper = require('app/helpers/common');


	return View.extend({
		attrs: ['firstName', 'lastName', 'email', 'role', 'password', 'passwordRepeat', 'site'],
		template: JST['assets/tpl/admin/user.add.html'],
		events: {
			'submit #edit-user-from': 'submit'
		},
		render: function () {
			this.$el.html(this.template({data: this.model.toJSON(), model: this.model}));
			return this;
		},
		submit: function (e) {
			e.preventDefault();
			var self = this;

			self.updateForm();

			self.model.save()
				.done(function (data) {
					CommonHelper.msg(polyglot.t("New user added"));
					Backbone.history.navigate('/user', {trigger: true});
				})
				.fail(function () {
					CommonHelper.parseResponse.apply(CommonHelper, arguments);
				});
		},
		updateForm: function () {
			var self = this;
			var data = {};

			_.each(self.attrs, function (attribute) {
				data[attribute] = self.$('.{attribute}'.replace('{attribute}', attribute)).val()
			});

			this.model.set(data);

			return this;
		}
	});

});