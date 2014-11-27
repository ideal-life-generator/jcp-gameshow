define(function (require) {
	'use strict';

	var QuestionEditView = require('./question_edit')
	var CommonHelper = require('app/helpers/common');

	return QuestionEditView.extend({
		attrs: ['categoryId', 'question', 'versionA', 'versionB', 'versionC', 'versionD', 'level', 'timeLimit', 'timePenalty'],
		template: JST['assets/tpl/admin/question.add.html'],
		events: {
			'submit .from-add-question': 'submit',
			'click .btn-version-a': 'setCorrectA',
			'click .btn-version-b': 'setCorrectB',
			'click .btn-version-c': 'setCorrectC',
			'click .btn-version-d': 'setCorrectD',
			'keyup .question, .versionA, .versionB, .versionC, .versionD, .timeLimit': 'updateModel'
		},
		initialize: function () {
			this.model.on('change:correct', this.render, this);
		},
		render: function () {
			this.$el.html(this.template({model: this.model, data: this.model.toJSON()}));
			return this;
		},
		submit: function (e) {
			e.preventDefault();

			this.updateModel();

			this.model.save()
				.done(function (data) {
					CommonHelper.msg(polyglot.t("New question added."));
					Backbone.history.navigate('/question/edit/:id'.replace(':id', data.id), {trigger: true});
				})
				.fail(function (jqXHR) {
					CommonHelper.parseResponse(jqXHR);
				});
		},
		updateModel: function () {
			var self = this;
			var data = {};

			_.each(this.attrs, function (attr) {
				data[attr] = self.$('.{attribute}'.replace('{attribute}', attr)).val()
			});

			this.model.set(data);
		},
		setCorrectA: function () {
			this.model.toggleCorrect('a');
		},
		setCorrectB: function () {
			this.model.toggleCorrect('b');
		},
		setCorrectC: function () {
			this.model.toggleCorrect('c');
		},
		setCorrectD: function () {
			this.model.toggleCorrect('d');
		}
	});

});