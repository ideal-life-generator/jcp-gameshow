define(function (require) {
	'use strict';

	var QuestionCollection = require('app/collections/question');
	var CategoryCollection = require('app/collections/category');
	var LevelCollection = require('app/collections/level');
	var LoadingView = require('app/views/loading');
	var CommonHelper = require('app/helpers/common');
	var QuestionModel = require('app/models/question');
	var QuestionListView = require('app/views/question_list');


	return function () {
		var questions = new QuestionCollection();
		var categories = new CategoryCollection();
		var levels = new LevelCollection();
		var loadingView = new LoadingView().render().html();

		$.when(questions.fetch(), categories.fetch(), levels.fetch())
			.done(function () {
				QuestionModel.prototype._categories = categories; // view QuestionModel::getCategoryName()
				QuestionModel.prototype._levels = levels; // view QuestionModel::getLevelName()

				$.when(categories.fetch())
				 .done(function(){
					new QuestionListView({collection: questions}).render().html();
				 });
			})
			.fail(function () {
				CommonHelper.errorMsg('Fetch failed.');
			})
			.always(function () {
				loadingView.remove();
			});

	};

});