define(function (require) {
	'use strict';

	var LoadingView = require('app/views/loading');
	var UserListView = require('app/views/user_list');
	var Users = require('app/collections/user');

	return function () {
		var loadingView = new LoadingView().render().html();
		var users = new Users();

		users.fetch()
			.done(function () {
				new UserListView({collection: users}).render().html();
			})
			.always(function () {
				loadingView.remove();
			});
	};
});