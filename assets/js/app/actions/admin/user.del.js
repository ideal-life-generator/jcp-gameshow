define(function (require) {
	'use strict';

	var UserModel = require('app/models/user');
	var LoadingView = require('app/views/loading');
	var CommonHelper = require('app/helpers/common');

	return function (id) {

		var user = new UserModel({id: id});
		var loadingView = new LoadingView().render().html();

		user.destroy()
			.done(function () {
				CommonHelper.msg('User successfully deleted.');
				Backbone.history.navigate('/user', {trigger: true});
			})
			.fail(function () {
				CommonHelper.errorMsg('User not found');
			})
			.always(function () {
				loadingView.remove();
			});

	};
});