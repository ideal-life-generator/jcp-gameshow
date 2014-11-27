define(function (require) {
	'use strict';

	var UserModel = require('app/models/user');
	var LoadingView = require('app/views/loading');
	var CommonHelper = require('app/helpers/common');
	var UserEditView = require('app/views/user_edit');

	return function (id) {
		var user = new UserModel({id: id});
		var loadingView = new LoadingView().render().html();

		user.fetch()
			.done(function () {
				new UserEditView({model: user}).render().html();
			})
			.fail(function () {
				CommonHelper.errorMsg('User not found');
			})
			.always(function () {
				loadingView.remove();
			});
	}
});