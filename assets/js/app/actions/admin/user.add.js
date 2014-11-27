define(function (require) {
	'use strict';

	var UserModel = require('app/models/user');
	var UserAddView = require('app/views/user_add');

	return function () {
		new UserAddView({model: new UserModel()}).render().html();
	}
});