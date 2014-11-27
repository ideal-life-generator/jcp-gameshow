define(function (require) {
	'use strict';

	var LoadingView = require('app/views/modal_loading');
	var CommonHelper = require('app/helpers/common');
	var View = require('app/base/view');

	return View.extend({
		redirectUrl: '/admin/index', // on success login redirect url
		className: 'container-fluid',
		id: 'common-login',
		template: JST['assets/tpl/admin/sign_in.html'],
		events: {
			'submit .login-form': 'submit'
		},
		initialize: function (options) {
			options = typeof options !== 'undefined' ? options : {};

			this.redirectUrl = typeof options.redirectUrl !== 'undefined' ? options.redirectUrl : this.redirectUrl;
		},
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));
			return this;
		},
		// vertical align hack
		align: function () {

			return this;
		},
		// submit form action
		submit: function (e) {
			e.preventDefault();

			var self = this;
			var loading = new LoadingView().render().html();

			this.refreshModel().login()
				.done(function () {
					window.location.href = self.redirectUrl;
				})
				.fail(function () {
					CommonHelper.errorMsg(polyglot.t("Login failed"));
				})
				.always(function () {
					loading.remove();
				});
		},
		refreshModel: function () {
			this.model.set('email', this.$('[name=email]').val());
			this.model.set('password', this.$('[name=password]').val());
			return this.model;
		}
	});
});