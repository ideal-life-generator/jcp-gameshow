define(function (require) {
	'use strict';

	var QuestionModel = require('app/models/question');
	var EditView = require('app/views/question_edit');
	var LoadingView = require('app/views/loading');
	var CommonHelper = require('app/helpers/common');
	var CategoryCollection = require('app/collections/category');
	var LevelCollection = require('app/collections/level');
	var $ = window.jQuery;

	return function (id) {

		var question = new QuestionModel({id: id});
		var loadingView = new LoadingView().render().html();
		var categories = new CategoryCollection();
		var levels = new LevelCollection();

		$.when(question.fetch(), categories.fetch(), levels.fetch())
			.done(function () {
				QuestionModel.prototype._categories = categories;
				QuestionModel.prototype._levels = levels;
				new EditView({model: question}).render().html();
			})
			.fail(function () {
				CommonHelper.errorMsg('Fetching error.');
			})
			.always(function () {
				loadingView.remove();
			});

	};
});