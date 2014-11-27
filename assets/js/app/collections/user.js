define(function (require) {
	'use strict';

	var UserModel = require('app/models/user');

	return Backbone.Collection.extend({
		url: '/user',
		model: UserModel
	});

});