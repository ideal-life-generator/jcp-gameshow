define(function (require) {
	'use strict';

	var View = require('app/base/view');
	var CommonHelper = require('app/helpers/common');

	return View.extend({
		attrs: ['categoryId', 'question', 'versionA', 'versionB', 'versionC', 'versionD', 'level', 'timeLimit'],
		events: {
			'submit .from-add-question': 'submit',
			'click .btn-version-a': 'setCorrectA',
			'click .btn-version-b': 'setCorrectB',
			'click .btn-version-c': 'setCorrectC',
			'click .btn-version-d': 'setCorrectD',
			'click .btn-upload-image': 'uploadImage',
			'keyup .question, .versionA, .versionB, .versionC, .versionD, .timeLimit': 'updateModel',
			'change .categoryId, .level': 'updateModel'
		},
		template: JST['assets/tpl/admin/question.edit.html'],
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
			var that = this;

			this.model.save()
				.done(function () {
					CommonHelper.msg(polyglot.t("Question successfully updated"));
					Backbone.history.navigate('/question', {trigger: true});
				})
				.fail(function () {
					CommonHelper.errorMessages(that.model.getErrors());
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
		uploadImage: function (e) {
			e.preventDefault();
			var self = this;

			$('<input type="file" name="image" />')
				.fileupload({
					url: '/question/upload_image/' + self.model.get('id'),
					dataType: 'json',
					add: function (e, data) {
						self.$('.btn-upload-image').addClass('disabled');
						data.submit();
					},
					success: function () {
						location.reload();
					}
				})
				.click();
		},
		setCorrectA: function () {
			this.model.toggleCorrect('a');
			this.updateModel();
		},
		setCorrectB: function () {
			this.model.toggleCorrect('b');
			this.updateModel();
		},
		setCorrectC: function () {
			this.model.toggleCorrect('c');
			this.updateModel();
		},
		setCorrectD: function () {
			this.model.toggleCorrect('d');
			this.updateModel();
		}
	});

});