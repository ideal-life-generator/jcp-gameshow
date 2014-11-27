define(function (require) {
	'use strict';

	var LoadingView = require('app/views/loading');
	var CategoryModel = require('app/models/category');
	var CommonHelper = require('app/helpers/common');
	var CategoryEditView = require('app/views/category_edit');

	return function (id) {
		var category = new CategoryModel({id: id});
		var loadingView = new LoadingView().render().html();

		category.save()
			.done(function () {
				new CategoryEditView({model: category}).render().html();
			})
			.fail(function () {
				CommonHelper.errorMsg('Category not found.');
			})
			.always(function () {
				loadingView.remove();
			})

	}
});