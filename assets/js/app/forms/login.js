define(function (require) {
	'use strict';

	var Model = require('app/base/model');

	return Model.extend({
		url: '/admin/login',
		login: function () {
			return $.ajax({
				type: 'post',
				url: this.url,
				data: this.toJSON()
			});
		}
	});

});