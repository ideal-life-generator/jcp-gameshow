define(function (require) {
	'use strict';

	var Model = require('app/base/model');

	return Model.extend({
		urlRoot: '/level',
		name: 'level'
	});

});