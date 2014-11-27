define(function (require) {
	'use strict';

	var QuestionModel = require('app/models/question');
	var QuestionAddView = require('app/views/question_add');
	var LoadingView = require('app/views/loading');
	var CategoryCollection = require('app/collections/category');
	var LevelCollection = require('app/collections/level');
	var CommonHelper = require('app/helpers/common');

	return function () {
		var loadingView = new LoadingView().render().html();
		var categories = new CategoryCollection();
		var levels = new LevelCollection();

		$.when(categories.fetch(), levels.fetch())
			.done(function () {
				QuestionModel.prototype._categories = categories;
				QuestionModel.prototype._levels = levels;
				new QuestionAddView({model: new QuestionModel()}).render().html();
			})
			.fail(function () {
				CommonHelper.errorMsg('Fail fetch.');
			})
			.always(function () {
				loadingView.remove();
			});
	}
});