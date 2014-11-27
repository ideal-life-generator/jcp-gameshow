define(function (require) {

	'use strict';

	var QuestionModel = require('app/models/question');

	return Backbone.Collection.extend({
		url: '/question',
		model: QuestionModel
	});

});