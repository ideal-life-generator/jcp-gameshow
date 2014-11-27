define(function (require) {
	'use strict';

	var DUMMY_IMAGE_URL = '/img/dummy_user.jpg';
	var _ = window._;
	var Model = require('app/base/model');

	return Model.extend({
		getImageUrl: function () {
			return this.get('imageUrl') ? this.get('imageUrl') : DUMMY_IMAGE_URL;
		},
		getFullName: function () {
			return this.get('firstName') + ' ' + this.get('lastName');
		},
		getRole: function () {
			return this.get('role') === 'admin' ? 'Admin' : 'User';
		},
		isAdmin: function () {
			return this.get('role') === 'admin';
		},
		isUser: function () {
			return this.get('role') === 'user';
		},
		isQuestionAnswered: function (question) {
			var questionId = question.get('id');
			var answers = this.get('answers');

			if (questionId) {
				for (var i in answers) {
					if (answers[i].id === questionId) return true;
				}
			}
			;

			return false;
		},
		getAnswer: function(questionId){
			var answers = this.get('answers');

			return answers[questionId];
		},
		getTimeLeft: function () {
			return parseFloat(this.get('timeLeft')).toFixed(1) || 0;
		}
	});
});