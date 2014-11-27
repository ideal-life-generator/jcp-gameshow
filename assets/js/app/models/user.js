define(function (require) {
	'use strict';

	var $ = window.jQuery;
	var Model = require('app/base/model');

	return Model.extend({
		name: 'user',
		urlRoot: '/user',
		getFullName : function(){
			return this.get('firstName') + ' ' + this.get('lastName');
		},

		fetchMe: function () {
			return this.fetch({
				url: '/user/me'
			});
		},

		login: function () {
			return $.ajax({
				url: '/user/sign_in',
				data: {
					email: this.get('email'),
					password: this.get('password')
				},
				type: 'POST'
			});
		},

		register: function () {
			return $.ajax({
				type: 'POST',
				url: '/user/register',
				data: this.toJSON()
			});
		}

	});

});