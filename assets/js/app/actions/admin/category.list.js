define(function (require) {
	'use strict';

	var CategoryCollection = require('app/collections/category');
	var LoadingView = require('app/views/loading');
	var CommonHelper = require('app/helpers/common');
	var CategoryListView = require('app/views/category_list');

	return function () {
		var categories = new CategoryCollection();
		var loadingView = new LoadingView().render().html();

		categories.fetch()
			.done(function () {
				new CategoryListView({collection: categories}).render().html();
			})
			.fail(function () {
				CommonHelper.errorMsg('Categories fetching Error.')
			})
			.always(function () {
				loadingView.remove();
			});

	}
});