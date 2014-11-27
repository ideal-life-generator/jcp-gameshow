define(function (require) {

	'use strict';

	var CategoryModel = require('app/models/category');

	return Backbone.Collection.extend({
		url: '/category',
		model: CategoryModel
	});

});