define(function (require) {
	'use strict';

	var LoadingView = require('app/views/loading');
	var CategoryModel = require('app/models/category');
	var CommonHelper = require('app/helpers/common');

	return function () {
		var category = new CategoryModel();
		var loadingView = new LoadingView().render().html();

		category.save()
			.done(function () {
				CommonHelper.msg('New category created successfully.');
				Backbone.history.navigate('/category/edit/:id'.replace(':id', category.get('id')), {trigger: true});
			})
			.fail(function () {
				CommonHelper.errorMsg('New category creation error.');
			})
			.always(function () {
				loadingView.remove();
			})
	}
});