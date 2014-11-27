define(function (require) {
	'use strict';

	var QuestionModel = require('app/models/question');
	var LoadingView = require('app/views/loading');
	var CommonHelper = require('app/helpers/common');

	return function (id) {
		var question = new QuestionModel({id: id});
		var loadingView = new LoadingView().render().html();

		question.destroy()
			.done(function () {
				CommonHelper.msg('Question deleted successfully.');
				Backbone.history.navigate('/question', {trigger: true});
			})
			.fail(function () {
				CommonHelper.errorMsg('Destroy failed.');
			})
			.always(function () {
				loadingView.remove();
			})

	}
});