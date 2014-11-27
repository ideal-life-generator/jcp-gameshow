define(function (require) {
	'use strict';

	var SignUpView = require('app/views/user_sign_up');
	var UserModel = require('app/models/user');

	return function () {
		new SignUpView({model: new UserModel()}).render().html();
	};
});